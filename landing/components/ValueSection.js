import { Component, createElement } from "../../src/index.js";
import { VALUE_CARDS } from "../constants.js";

export class ValueSection extends Component {
  render = async () => {
    return createElement("section", { id: "value", className: "section reveal delay-2" }, [
      createElement("h2", { className: "section-title" }, "Why teams adopt salt-lib"),
      createElement(
        "p",
        { className: "section-subtitle" },
        "It keeps the runtime small and mental models simple: explicit mount points, predictable updates, and straightforward composition.",
      ),
      createElement(
        "div",
        { className: "value-grid" },
        VALUE_CARDS.map((card) =>
          createElement("article", { className: "value-card" }, [
            createElement("h3", {}, card.title),
            createElement("p", {}, card.copy),
          ]),
        ),
      ),
    ]);
  };
}
