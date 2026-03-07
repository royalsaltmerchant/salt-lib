import { Component, createElement } from "../../src/index.js";
import { HtmlOptionsCard } from "./HtmlOptionsCard.js";
import { MemoCard } from "./MemoCard.js";
import { RaceDemoCard } from "./RaceDemoCard.js";
import { UseChildDemoCard } from "./UseChildDemoCard.js";

export class PlaygroundSection extends Component {
  renderMemoCard = async () => {
    return this.childElem(
      "memo-card",
      () =>
        new MemoCard({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
        }),
      null,
    );
  };

  renderUseChildDemo = async () => {
    return this.childElem(
      "use-child-demo",
      () =>
        new UseChildDemoCard({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
        }),
      null,
    );
  };

  renderHtmlOptionsCard = async () => {
    return this.childElem(
      "html-options-card",
      () =>
        new HtmlOptionsCard({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
        }),
      null,
    );
  };

  renderRaceDemoCard = async () => {
    return this.childElem(
      "race-demo-card",
      () =>
        new RaceDemoCard({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
        }),
      null,
    );
  };

  render = async () => {
    const memoCardElem = await this.renderMemoCard();
    const useChildCardElem = await this.renderUseChildDemo();
    const htmlCardElem = await this.renderHtmlOptionsCard();
    const raceCardElem = await this.renderRaceDemoCard();

    return createElement("section", { id: "playground", className: "section reveal delay-3" }, [
      createElement("h2", { className: "section-title" }, "Live feature playground"),
      createElement(
        "p",
        { className: "section-subtitle" },
        "Each card owns its own state, so interactions rerender only that card's subtree.",
      ),
      createElement("div", { className: "playground-grid" }, [
        memoCardElem,
        useChildCardElem,
        htmlCardElem,
        raceCardElem,
      ]),
    ]);
  };
}
