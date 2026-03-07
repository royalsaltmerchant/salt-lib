import { Component, createElement } from "../../src/index.js";
import { SnippetSwitcher } from "./SnippetSwitcher.js";

export class HowToUseSection extends Component {
  renderSnippetSwitcher = async () => {
    return this.childElem(
      "snippet-switcher",
      () =>
        new SnippetSwitcher({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
        }),
      null,
    );
  };

  render = async () => {
    const snippetSwitcherElem = await this.renderSnippetSwitcher();

    return createElement("section", { id: "quickstart", className: "section reveal delay-4" }, [
      createElement("h2", { className: "section-title" }, "How to use it"),
      createElement(
        "p",
        { className: "section-subtitle" },
        "Start with a mount node, extend Component, return render output, then compose nested components with childElem.",
      ),
      snippetSwitcherElem,
      createElement("ol", { className: "steps" }, [
        createElement("li", {}, "Install with npm."),
        createElement("li", {}, "Create a root component and mount it with domElem."),
        createElement("li", {}, "Return DOM output from render(), sync or async."),
        createElement("li", {}, "Use setState() to update and rerender."),
        createElement("li", {}, "Use childElem() when you need nested component instances."),
      ]),
    ]);
  };
}
