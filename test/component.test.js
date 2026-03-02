import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

import { Component, LegacyComponent, createElement } from "../src/index.js";

class FakeNode {}

class FakeTextNode extends FakeNode {
  constructor(text) {
    super();
    this.nodeType = 3;
    this.parentNode = null;
    this.childNodes = [];
    this.textContent = String(text);
  }
}

class FakeElement extends FakeNode {
  constructor(tagName) {
    super();
    this.nodeType = 1;
    this.tagName = String(tagName).toUpperCase();
    this.parentNode = null;
    this.childNodes = [];
    this.attributes = {};
    this.style = {};
    this.dataset = {};
    this.eventListeners = [];
    this._innerHTML = "";
  }

  setAttribute(name, value) {
    this.attributes[String(name)] = String(value);
  }

  removeAttribute(name) {
    delete this.attributes[String(name)];
  }

  addEventListener(type, handler, options) {
    this.eventListeners.push({
      type,
      handler,
      options,
    });
  }

  removeEventListener(type, handler) {
    this.eventListeners = this.eventListeners.filter(
      (listener) => listener.type !== type || listener.handler !== handler,
    );
  }

  append(...nodes) {
    for (const node of nodes) {
      if (node === null || typeof node === "undefined") continue;
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
      node.parentNode = this;
      this.childNodes.push(node);
    }
  }

  appendChild(node) {
    this.append(node);
    return node;
  }

  prepend(...nodes) {
    for (let i = nodes.length - 1; i >= 0; i -= 1) {
      const node = nodes[i];
      if (node === null || typeof node === "undefined") continue;
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
      node.parentNode = this;
      this.childNodes.unshift(node);
    }
  }

  replaceChildren(...nodes) {
    const current = this.childNodes.slice();
    for (const child of current) {
      this.removeChild(child);
    }
    this.append(...nodes);
  }

  insertBefore(node, referenceNode) {
    if (!referenceNode) {
      this.append(node);
      return node;
    }

    const index = this.childNodes.indexOf(referenceNode);
    if (index < 0) {
      this.append(node);
      return node;
    }

    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
    node.parentNode = this;
    this.childNodes.splice(index, 0, node);
    return node;
  }

  insertAdjacentElement(position, element) {
    if (position === "beforeend") {
      this.append(element);
      return element;
    }
    throw new Error(`Unsupported insertAdjacentElement position: ${position}`);
  }

  insertAdjacentHTML(position, html) {
    if (position !== "beforeend") {
      throw new Error(`Unsupported insertAdjacentHTML position: ${position}`);
    }
    this._innerHTML += String(html);
  }

  removeChild(node) {
    const index = this.childNodes.indexOf(node);
    if (index >= 0) {
      this.childNodes.splice(index, 1);
      node.parentNode = null;
    }
    return node;
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
    this.childNodes = [];
  }

  get innerHTML() {
    return this._innerHTML;
  }
}

class FakeDocument {
  createElement(tagName) {
    return new FakeElement(tagName);
  }

  createTextNode(text) {
    return new FakeTextNode(text);
  }
}

const flush = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};

const wait = async (ms) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

const readText = (node) => {
  if (!node) return "";
  if (node.nodeType === 3) return node.textContent || "";
  return (node.childNodes || []).map(readText).join("");
};

beforeEach(() => {
  globalThis.Node = FakeNode;
  globalThis.document = new FakeDocument();
});

test("component defaults to an auto-created mount element", () => {
  const component = new Component();
  assert.equal(component.domElem.tagName, "DIV");
  assert.equal(component.domElem.parentNode, null);
});

test("component uses provided domElem when passed", () => {
  const mount = document.createElement("section");
  const component = new Component({ domElem: mount });
  assert.equal(component.domElem, mount);
});

test("legacy child/parent helpers are absent and childElem is available", () => {
  const component = new Component();
  assert.equal(typeof component.child, "undefined");
  assert.equal(typeof component.parent, "undefined");
  assert.equal(typeof component.childElem, "function");
});

test("useMemo reuses node when deps are unchanged and recomputes when changed", async () => {
  class MemoComponent extends Component {
    render = async () => {
      const title = this.useMemo(
        "title",
        () => createElement("h1", {}, this.props.title),
        [this.props.title],
      );
      return [title];
    };
  }

  const component = new MemoComponent({
    title: "Players",
    autoRender: true,
  });

  await flush();
  const firstNode = component.domElem.childNodes[0];
  assert.equal(readText(firstNode), "Players");

  component.props.title = "Players";
  await component.render();
  const secondNode = component.domElem.childNodes[0];
  assert.equal(firstNode, secondNode);

  component.props.title = "Game Master";
  await component.render();
  const thirdNode = component.domElem.childNodes[0];
  assert.notEqual(secondNode, thirdNode);
  assert.equal(readText(thirdNode), "Game Master");
});

test("setState updates state and triggers render by default", async () => {
  class Counter extends Component {
    state = { count: 0 };
    renderCalls = 0;

    render = async () => {
      this.renderCalls += 1;
      return [createElement("div", {}, String(this.state.count))];
    };
  }

  const counter = new Counter({ autoRender: true });
  await flush();
  assert.equal(counter.renderCalls, 1);
  assert.equal(readText(counter.domElem), "0");

  await counter.setState((prev) => ({ count: prev.count + 1 }));
  assert.equal(counter.state.count, 1);
  assert.equal(counter.renderCalls, 2);
  assert.equal(readText(counter.domElem), "1");

  await counter.setState({ count: 5 }, { render: false });
  assert.equal(counter.state.count, 5);
  assert.equal(counter.renderCalls, 2);
  assert.equal(readText(counter.domElem), "1");
});

test("cleanup handlers run on destroy and support unsubscribe", () => {
  const component = new Component();

  let first = 0;
  let second = 0;

  const unsubscribeFirst = component.onCleanup(() => {
    first += 1;
  });
  component.onCleanup(() => {
    second += 1;
  });

  unsubscribeFirst();
  component.destroy({ clear: false, clearMemo: false });

  assert.equal(first, 0);
  assert.equal(second, 1);
});

test("render race protection keeps latest render result", async () => {
  class RaceComponent extends Component {
    render = async (label, delayMs) => {
      await wait(delayMs);
      return [createElement("div", {}, label)];
    };
  }

  const race = new RaceComponent();
  await flush();

  const slow = race.render("slow", 30);
  const fast = race.render("fast", 0);
  await Promise.all([slow, fast]);

  assert.equal(readText(race.domElem), "fast");
});

test("constructor-time render call mounts output", async () => {
  class ConstructorRenderComponent extends Component {
    renderCalls = 0;

    constructor(props = {}) {
      super(props);
      this.render();
    }

    render = () => {
      this.renderCalls += 1;
      return [createElement("div", {}, "mounted")];
    };
  }

  const component = new ConstructorRenderComponent();
  await flush();
  assert.equal(component.renderCalls, 1);
  assert.equal(readText(component.domElem), "mounted");
});

test("auto lifecycle defaults to init + render without duplicate first render", async () => {
  class InitRenderComponent extends Component {
    initCalls = 0;
    renderCalls = 0;

    init = async () => {
      this.initCalls += 1;
      await this.render();
    };

    render = async () => {
      this.renderCalls += 1;
      return [createElement("div", {}, `run:${this.renderCalls}`)];
    };
  }

  const component = new InitRenderComponent();
  await flush();

  assert.equal(component.initCalls, 1);
  assert.equal(component.renderCalls, 1);
  assert.equal(readText(component.domElem), "run:1");
});

test("auto lifecycle can be disabled", async () => {
  class ManualLifecycleComponent extends Component {
    initCalls = 0;
    renderCalls = 0;

    init = async () => {
      this.initCalls += 1;
    };

    render = async () => {
      this.renderCalls += 1;
      return [createElement("div", {}, "manual")];
    };
  }

  const component = new ManualLifecycleComponent({
    autoInit: false,
    autoRender: false,
  });
  await flush();

  assert.equal(component.initCalls, 0);
  assert.equal(component.renderCalls, 0);
  assert.equal(component.domElem.childNodes.length, 0);
});

test("useChild caches by key and allows update + drop", () => {
  const component = new Component({ autoInit: false, autoRender: false });

  let createCalls = 0;
  let destroyCalls = 0;

  const first = component.useChild(
    "attack",
    () => {
      createCalls += 1;
      return {
        domElem: createElement("div"),
        value: 0,
        destroy: () => {
          destroyCalls += 1;
        },
      };
    },
    (child) => {
      child.value = 1;
    },
  );

  const second = component.useChild(
    "attack",
    () => {
      createCalls += 1;
      return {
        domElem: createElement("div"),
      };
    },
    (child) => {
      child.value = 2;
    },
  );

  assert.equal(createCalls, 1);
  assert.equal(first, second);
  assert.equal(second.value, 2);

  const removed = component.dropChild("attack");
  assert.equal(removed, first);
  assert.equal(destroyCalls, 1);
});

test("childElem reuses child, renders it, and returns domElem", async () => {
  class ChildCounter extends Component {
    renderCalls = 0;

    render = async () => {
      this.renderCalls += 1;
      return [createElement("div", {}, String(this.props.count))];
    };
  }

  const component = new Component({ autoInit: false, autoRender: false });

  const firstElem = await component.childElem(
    "counter",
    () =>
      new ChildCounter({
        domElem: createElement("div"),
        autoInit: false,
        autoRender: false,
        count: 0,
      }),
    (child) => {
      child.props.count = 1;
    },
  );

  assert.equal(readText(firstElem), "1");

  const secondElem = await component.childElem(
    "counter",
    () => {
      throw new Error("factory should not run twice for same key");
    },
    (child) => {
      child.props.count = 2;
    },
  );

  assert.equal(secondElem, firstElem);
  assert.equal(readText(secondElem), "2");
});

test("destroy tears down cached useChild children", () => {
  const component = new Component({ autoInit: false, autoRender: false });

  let childOneDestroyed = 0;
  let childTwoDestroyed = 0;

  component.useChild("one", () => ({
    domElem: createElement("div"),
    destroy: () => {
      childOneDestroyed += 1;
    },
  }));

  component.useChild("two", () => ({
    domElem: createElement("div"),
    destroy: () => {
      childTwoDestroyed += 1;
    },
  }));

  component.destroy({ clear: false, clearMemo: false });

  assert.equal(childOneDestroyed, 1);
  assert.equal(childTwoDestroyed, 1);
});

test("LegacyComponent keeps imperative render behavior", async () => {
  class LegacyCounter extends LegacyComponent {
    render = async () => {
      this.domElem.append(createElement("div", {}, "tick"));
      return [createElement("div", {}, "ignored")];
    };
  }

  const component = new LegacyCounter({ autoInit: false, autoRender: false });

  await component.render();
  await component.render();

  // Legacy mode does not clear first and does not auto-append returned nodes.
  assert.equal(readText(component.domElem), "ticktick");
});
