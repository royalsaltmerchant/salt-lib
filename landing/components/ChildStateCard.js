import { Component, createElement } from "../../src/index.js";

export class ChildStateCard extends Component {
  state = { localClicks: 0 };

  incrementLocal = async () => {
    await this.setState((prev) => ({ localClicks: prev.localClicks + 1 }));
  };

  render = async () => {
    const onIncrementParent =
      typeof this.props.onIncrementParent === "function"
        ? this.props.onIncrementParent
        : null;

    return createElement("article", { className: "play-card nested-card" }, [
      createElement("h3", {}, "useChild cache"),
      createElement(
        "p",
        { className: "play-copy" },
        "This child keeps local state even while parent renders keep changing.",
      ),
      createElement("div", { className: "metric-value" }, String(this.props.parentCount)),
      createElement(
        "p",
        { className: "metric-note" },
        `Parent count prop: ${this.props.parentCount}`,
      ),
      createElement(
        "p",
        { className: "metric-note" },
        `Child local clicks: ${this.state.localClicks}`,
      ),
      createElement(
        "button",
        { type: "button", className: "button button-secondary" },
        "Increment child state",
        { type: "click", event: this.incrementLocal },
      ),
      onIncrementParent
        ? createElement(
            "button",
            { type: "button", className: "button button-ghost" },
            "+1 parent prop",
            { type: "click", event: onIncrementParent },
          )
        : null,
    ]);
  };
}
