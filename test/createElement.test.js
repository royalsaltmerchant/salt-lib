import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

import { createElement } from "../src/createElement.js";

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

  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, String(name));
  }

  getAttribute(name) {
    return this.hasAttribute(name) ? this.attributes[String(name)] : null;
  }

  appendChild(node) {
    node.parentNode = this;
    this.childNodes.push(node);
    return node;
  }

  addEventListener(type, handler, options) {
    this.eventListeners.push({
      type,
      handler,
      options,
    });
  }

  insertAdjacentHTML(position, html) {
    if (position !== "beforeend") {
      throw new Error(`Unsupported insertAdjacentHTML position: ${position}`);
    }
    this._innerHTML += String(html);
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

beforeEach(() => {
  globalThis.Node = FakeNode;
  globalThis.document = new FakeDocument();
});

test("renders 0 and empty string children", () => {
  const elem = createElement("div", {}, [0, "", false, null, undefined]);

  assert.equal(elem.childNodes.length, 2);
  assert.equal(elem.childNodes[0].textContent, "0");
  assert.equal(elem.childNodes[1].textContent, "");
});

test("applies className, style, dataset, and boolean attributes", () => {
  const elem = createElement("button", {
    className: "primary",
    style: {
      color: "red",
      fontSize: "14px",
    },
    dataset: {
      key: "alpha",
      order: 2,
    },
    disabled: true,
    hidden: false,
    title: "Open",
  });

  assert.equal(elem.getAttribute("class"), "primary");
  assert.equal(elem.style.color, "red");
  assert.equal(elem.style.fontSize, "14px");
  assert.equal(elem.dataset.key, "alpha");
  assert.equal(elem.dataset.order, "2");
  assert.equal(elem.hasAttribute("disabled"), true);
  assert.equal(elem.hasAttribute("hidden"), false);
  assert.equal(elem.getAttribute("title"), "Open");
});

test("attaches event listeners with options", () => {
  const handler = () => {};
  const options = { once: true, passive: true };

  const elem = createElement("div", {}, null, {
    type: "click",
    event: handler,
    options,
  });

  assert.equal(elem.eventListeners.length, 1);
  assert.equal(elem.eventListeners[0].type, "click");
  assert.equal(elem.eventListeners[0].handler, handler);
  assert.deepEqual(elem.eventListeners[0].options, options);
});

test("flattens nested child arrays", () => {
  const childNode = document.createElement("span");
  const elem = createElement("div", {}, ["a", [childNode, ["b"]]]);

  assert.equal(elem.childNodes.length, 3);
  assert.equal(elem.childNodes[0].textContent, "a");
  assert.equal(elem.childNodes[1], childNode);
  assert.equal(elem.childNodes[2].textContent, "b");
});

test("uses allowHtml only when explicitly enabled", () => {
  const unsafe = "<em>hello</em>";
  const defaultElem = createElement("div", {}, unsafe);
  const htmlElem = createElement("div", {}, unsafe, null, { allowHtml: true });

  assert.equal(defaultElem.childNodes.length, 1);
  assert.equal(defaultElem.childNodes[0].textContent, unsafe);
  assert.equal(defaultElem.innerHTML, "");

  assert.equal(htmlElem.childNodes.length, 0);
  assert.equal(htmlElem.innerHTML, unsafe);
});

test("throws for invalid element tag", () => {
  assert.throws(
    () => createElement(undefined),
    /non-empty element tag string/,
  );
  assert.throws(
    () => createElement(""),
    /non-empty element tag string/,
  );
});
