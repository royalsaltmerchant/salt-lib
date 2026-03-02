import { Component, createElement } from "../../src/index.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class StatusBox extends Component {
  render = async () => {
    return [
      createElement("article", { className: "card" }, [
        createElement("h2", { className: "card-title" }, "Status"),
        createElement("div", { className: "card-value" }, String(this.props.count)),
        createElement("small", {}, this.props.statusText),
      ]),
    ];
  };
}

class DemoApp extends Component {
  state = { count: 0, title: "salt-lib Core Demo", loading: false };

  renderHeader = () =>
    this.useMemo(
      "header",
      () => createElement("h1", {}, this.state.title),
      [this.state.title],
    );

  renderStatusBox = async () => {
    return this.childElem(
      "status-box",
      () =>
        new StatusBox({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
          count: this.state.count,
          statusText: "Ready",
        }),
      (child) => {
        child.props.count = this.state.count;
        child.props.statusText = this.state.loading ? "Updating..." : "Ready";
      },
    );
  };

  incrementCount = async () => {
    await this.setState((prev) => ({ count: prev.count + 1 }));
  };

  resetCount = async () => {
    await this.setState({ count: 0 });
  };

  renameTitle = async () => {
    const nextTitle =
      this.state.title === "salt-lib Core Demo"
        ? "salt-lib Minimal Runtime"
        : "salt-lib Core Demo";
    await this.setState({ title: nextTitle });
  };

  addAsync = async () => {
    await this.setState({ loading: true }, { render: false });
    await wait(500);
    await this.setState((prev) => ({ count: prev.count + 5, loading: false }));
  };

  renderActions = () => {
    return createElement("div", { className: "toolbar" }, [
      createElement(
        "button",
        { type: "button" },
        "+1 count",
        { type: "click", event: this.incrementCount },
      ),
      createElement(
        "button",
        { type: "button", className: "secondary" },
        "+5 async",
        { type: "click", event: this.addAsync },
      ),
      createElement(
        "button",
        { type: "button", className: "secondary" },
        "Rename title",
        { type: "click", event: this.renameTitle },
      ),
      createElement(
        "button",
        { type: "button", className: "secondary" },
        "Reset",
        { type: "click", event: this.resetCount },
      ),
    ]);
  };

  render = async () => {
    const statusBoxElem = await this.renderStatusBox();

    return [
      this.renderHeader(),
      createElement(
        "p",
        { className: "subtitle" },
        "Uses useMemo + useChild + setState + explicit mount",
      ),
      this.renderActions(),
      statusBoxElem,
    ];
  };
}

const appRoot = document.getElementById("app");
if (!appRoot) {
  throw new Error("Missing #app root element");
}

new DemoApp({ domElem: appRoot });
