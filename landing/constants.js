export const INSTALL_COMMAND = "npm install @royalsaltmerchant/salt-lib";

export const CODE_SNIPPETS = {
  quickstart: `import { Component, createElement } from "@royalsaltmerchant/salt-lib";

class App extends Component {
  state = { count: 0 };

  increment = async () => {
    await this.setState((prev) => ({ count: prev.count + 1 }));
  };

  render = async () => {
    return [
      createElement("h1", {}, "salt-lib"),
      createElement("p", {}, "Count: " + this.state.count),
      createElement(
        "button",
        { type: "button" },
        "+1",
        { type: "click", event: this.increment },
      ),
    ];
  };
}

new App({ domElem: document.getElementById("app") });`,
  component: `class Parent extends Component {
  state = { title: "Dashboard", views: 12 };

  bumpViews = async () => {
    await this.setState((prev) => ({ views: prev.views + 1 }));
  };

  renderHeaderCard = async () => {
    return this.childElem(
      "header-card",
      () =>
        new HeaderCard({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
          title: this.state.title,
          views: this.state.views,
        }),
      (child) => {
        child.props.title = this.state.title;
        child.props.views = this.state.views;
      },
    );
  };

  render = async () => {
    const headerCardElem = await this.renderHeaderCard();

    return [
      createElement("h1", {}, "Parent"),
      createElement(
        "button",
        { type: "button" },
        "+1 view",
        { type: "click", event: this.bumpViews },
      ),
      headerCardElem,
    ];
  };
}

class HeaderCard extends Component {
  render = async () => {
    return createElement("article", { className: "card" }, [
      createElement("h2", {}, this.props.title),
      createElement("p", {}, "Views: " + this.props.views),
    ]);
  };
}

new Parent({ domElem: document.getElementById("app") });`,
  createElement: `const button = createElement(
  "button",
  {
    className: "cta",
    style: { background: "#10243f", color: "#fff" },
    dataset: { track: "hero-cta" },
  },
  "Start",
  { type: "click", event: onStart },
);

const trusted = createElement(
  "div",
  {},
  "<strong>Trusted HTML</strong>",
  null,
  { allowHtml: true },
);`,
};

export const SNIPPET_TABS = [
  { key: "quickstart", label: "Quickstart" },
  { key: "component", label: "Component API" },
  { key: "createElement", label: "createElement API" },
];

export const VALUE_CARDS = [
  {
    title: "Predictable full-frame renders",
    copy: "Every render clears then appends the next output, so each frame is coherent and explicit.",
  },
  {
    title: "Async-safe by default",
    copy: "When renders overlap, stale older renders are discarded and the latest intent wins.",
  },
  {
    title: "Composable children with lifecycle control",
    copy: "Use useChild/childElem to preserve child instances, update props, and clean up cleanly.",
  },
  {
    title: "Low-level DOM creation that stays ergonomic",
    copy: "createElement supports style objects, dataset, event listeners, and optional trusted HTML.",
  },
];
