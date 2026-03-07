import { Component, createElement } from "../../src/index.js";

export class MemoCard extends Component {
  state = {
    signalCount: 5,
    memoNoise: 0,
  };

  memoRuns = 0;

  incrementSignal = async () => {
    await this.setState((prev) => ({ signalCount: prev.signalCount + 1 }));
  };

  rerenderWithoutMemoDeps = async () => {
    await this.setState((prev) => ({ memoNoise: prev.memoNoise + 1 }));
  };

  render = async () => {
    const stabilityScore = this.useMemo(
      "stability-score",
      () => {
        this.memoRuns += 1;
        return this.state.signalCount * 12 + 36;
      },
      [this.state.signalCount],
    );

    return createElement("article", { className: "play-card" }, [
      createElement("h3", {}, "useMemo"),
      createElement(
        "p",
        { className: "play-copy" },
        "Memoized value recomputes only when signalCount changes.",
      ),
      createElement("div", { className: "metric-value" }, String(stabilityScore)),
      createElement("p", { className: "metric-note" }, `Memo recomputations: ${this.memoRuns}`),
      createElement("p", { className: "metric-note" }, `Signal count: ${this.state.signalCount}`),
      createElement("div", { className: "chip-row" }, [
        createElement(
          "button",
          { type: "button", className: "button button-secondary" },
          "+1 signal",
          { type: "click", event: this.incrementSignal },
        ),
        createElement(
          "button",
          { type: "button", className: "button button-ghost" },
          "Rerender without deps",
          { type: "click", event: this.rerenderWithoutMemoDeps },
        ),
      ]),
      createElement("p", { className: "metric-note" }, `Unrelated rerenders: ${this.state.memoNoise}`),
    ]);
  };
}
