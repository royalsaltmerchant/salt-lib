import { Component, createElement } from "../../src/index.js";

export class HtmlOptionsCard extends Component {
  state = { trustedHtml: false };

  toggleTrustedHtml = async () => {
    await this.setState((prev) => ({ trustedHtml: !prev.trustedHtml }));
  };

  render = async () => {
    const preview = createElement(
      "div",
      {
        className: "html-preview",
        dataset: { mode: this.state.trustedHtml ? "html" : "text" },
        style: {
          borderColor: this.state.trustedHtml ? "var(--accent)" : "var(--line-soft)",
        },
      },
      this.state.trustedHtml
        ? "<strong>Trusted markup:</strong> <em>allowHtml inserted this as real HTML.</em>"
        : "<strong>Text mode:</strong> allowHtml is false, so tags are escaped.",
      null,
      { allowHtml: this.state.trustedHtml },
    );

    return createElement("article", { className: "play-card" }, [
      createElement("h3", {}, "createElement options"),
      createElement(
        "p",
        { className: "play-copy" },
        "Toggle trusted HTML to see allowHtml behavior. This box also uses dataset and style object attributes.",
      ),
      preview,
      createElement("div", { className: "chip-row" }, [
        createElement(
          "button",
          { type: "button", className: "button button-secondary" },
          this.state.trustedHtml ? "Disable allowHtml" : "Enable allowHtml",
          { type: "click", event: this.toggleTrustedHtml },
        ),
      ]),
    ]);
  };
}
