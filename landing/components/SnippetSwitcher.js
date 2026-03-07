import { Component, createElement } from "../../src/index.js";
import { CODE_SNIPPETS, SNIPPET_TABS } from "../constants.js";

export class SnippetSwitcher extends Component {
  state = { activeSnippet: "quickstart" };

  selectSnippet = async (key) => {
    if (!CODE_SNIPPETS[key] || key === this.state.activeSnippet) return;
    await this.setState({ activeSnippet: key });
  };

  render = async () => {
    return createElement("div", { className: "snippet-switcher" }, [
      createElement(
        "div",
        { className: "snippet-tabs" },
        SNIPPET_TABS.map((tab) =>
          createElement(
            "button",
            {
              type: "button",
              className: `chip${this.state.activeSnippet === tab.key ? " chip-active" : ""}`,
            },
            tab.label,
            { type: "click", event: () => this.selectSnippet(tab.key) },
          ),
        ),
      ),
      createElement(
        "pre",
        { className: "code-block" },
        createElement("code", { className: "mono" }, CODE_SNIPPETS[this.state.activeSnippet]),
      ),
    ]);
  };
}
