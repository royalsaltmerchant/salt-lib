import { Component, createElement } from "../../src/index.js";
import { ChildStateCard } from "./ChildStateCard.js";

export class UseChildDemoCard extends Component {
  state = { parentCount: 5 };

  incrementParent = async () => {
    await this.setState((prev) => ({ parentCount: prev.parentCount + 1 }));
  };

  renderNestedCard = async () => {
    return this.childElem(
      "nested-use-child-card",
      () =>
        new ChildStateCard({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
          parentCount: this.state.parentCount,
          onIncrementParent: this.incrementParent,
        }),
      (child) => {
        child.props.parentCount = this.state.parentCount;
        child.props.onIncrementParent = this.incrementParent;
      },
    );
  };

  render = async () => {
    return this.renderNestedCard();
  };
}
