import { Component, createElement } from "../../src/index.js";
import { InstallPill } from "./InstallPill.js";

export class HeroSection extends Component {
  renderInstallPill = async () => {
    return this.childElem(
      "install-pill",
      () =>
        new InstallPill({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
        }),
      null,
    );
  };

  render = async () => {
    const installPillElem = await this.renderInstallPill();

    return createElement("section", { id: "top", className: "hero reveal delay-1" }, [
      createElement("p", { className: "hero-kicker" }, "Vanilla JS component runtime"),
      createElement("h1", { className: "hero-title" }, "Ship dynamic UI without a virtual DOM."),
      createElement(
        "p",
        { className: "hero-copy" },
        "salt-lib gives you predictable render behavior, async-safe updates, and explicit component composition in plain JavaScript.",
      ),
      createElement("div", { className: "hero-cta" }, [
        createElement("a", { href: "#quickstart", className: "button button-secondary" }, [
          "Read quickstart",
        ]),
        createElement("a", { href: "#playground", className: "button button-ghost" }, [
          "Try live features",
        ]),
      ]),
      installPillElem,
    ]);
  };
}
