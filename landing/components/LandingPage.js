import { Component, createElement } from "../../src/index.js";
import { HeroSection } from "./HeroSection.js";
import { HowToUseSection } from "./HowToUseSection.js";
import { PlaygroundSection } from "./PlaygroundSection.js";
import { ValueSection } from "./ValueSection.js";

export class LandingPage extends Component {
  renderHeroSection = async () => {
    return this.childElem(
      "hero-section",
      () =>
        new HeroSection({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
        }),
      null,
    );
  };

  renderValueSection = async () => {
    return this.childElem(
      "value-section",
      () =>
        new ValueSection({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
        }),
      null,
    );
  };

  renderPlaygroundSection = async () => {
    return this.childElem(
      "playground-section",
      () =>
        new PlaygroundSection({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
        }),
      null,
    );
  };

  renderHowToUseSection = async () => {
    return this.childElem(
      "how-to-use-section",
      () =>
        new HowToUseSection({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
        }),
      null,
    );
  };

  renderHeader = () => {
    return createElement("header", { className: "site-header reveal delay-1" }, [
      createElement("a", { href: "#top", className: "brand" }, [
        createElement("span", { className: "brand-mark" }, "S"),
        createElement("span", {}, "salt-lib"),
      ]),
      createElement("nav", { className: "top-nav" }, [
        createElement("a", { href: "#value" }, "Value"),
        createElement("a", { href: "#playground" }, "Playground"),
        createElement("a", { href: "#quickstart" }, "How to use"),
      ]),
    ]);
  };

  renderFooter = () => {
    return createElement("footer", { className: "footer" }, [
      createElement("p", {}, [
        "MIT licensed. Built with salt-lib itself. ",
        createElement("a", { href: "https://docs.github.com/en/pages" }, "Deploy with GitHub Pages"),
        ".",
      ]),
    ]);
  };

  render = async () => {
    const heroSectionElem = await this.renderHeroSection();
    const valueSectionElem = await this.renderValueSection();
    const playgroundSectionElem = await this.renderPlaygroundSection();
    const howToUseSectionElem = await this.renderHowToUseSection();

    return createElement("div", { className: "landing" }, [
      this.renderHeader(),
      createElement("main", { className: "content-wrap" }, [
        heroSectionElem,
        valueSectionElem,
        playgroundSectionElem,
        howToUseSectionElem,
      ]),
      this.renderFooter(),
    ]);
  };
}
