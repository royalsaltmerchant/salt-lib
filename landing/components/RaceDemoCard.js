import { Component, createElement } from "../../src/index.js";
import { wait } from "../utils.js";

export class RaceDemoCard extends Component {
  state = {
    raceCycle: 0,
    raceVersion: 0,
    raceDelayMs: 0,
    raceStatus: "Click run race to test render overlap.",
  };

  runRenderRace = async () => {
    const nextCycle = this.state.raceCycle + 1;

    void this.setState({
      raceCycle: nextCycle,
      raceVersion: nextCycle * 2 - 1,
      raceDelayMs: 900,
      raceStatus: `Cycle ${nextCycle}: slow frame started (900ms)`,
    });

    await wait(40);

    void this.setState({
      raceVersion: nextCycle * 2,
      raceDelayMs: 140,
      raceStatus: `Cycle ${nextCycle}: fast frame started (140ms)`,
    });

    await wait(260);

    await this.setState({
      raceDelayMs: 0,
      raceStatus: `Cycle ${nextCycle}: latest frame kept, stale frame dropped.`,
    });
  };

  render = async () => {
    const delayMs = Math.max(0, Number(this.state.raceDelayMs) || 0);
    if (delayMs > 0) {
      await wait(delayMs);
    }

    return createElement("div", { className: "race-shell" }, [
      createElement("article", { className: "play-card race-card" }, [
        createElement("h3", {}, "Async stale-render guard"),
        createElement(
          "p",
          { className: "play-copy" },
          "This card waits during render. Older render results are dropped if a newer render starts.",
        ),
        createElement("div", { className: "metric-value" }, `Frame v${this.state.raceVersion}`),
        createElement("p", { className: "metric-note" }, `Delay for this frame: ${delayMs}ms`),
        createElement("p", { className: "metric-note" }, this.state.raceStatus),
      ]),
      createElement("p", { className: "metric-note race-cycle-note" }, `Race cycles run: ${this.state.raceCycle}`),
      createElement(
        "button",
        {
          type: "button",
          className: "button",
          style: { marginTop: "10px", width: "100%" },
        },
        "Run render race",
        { type: "click", event: this.runRenderRace },
      ),
    ]);
  };
}
