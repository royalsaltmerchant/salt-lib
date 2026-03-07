import { Component, createElement } from "../../src/index.js";
import { INSTALL_COMMAND } from "../constants.js";

const COPY_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="M9 9h10v12H9z" fill="none" stroke="currentColor" stroke-width="1.8" />
  <path d="M5 3h10v3" fill="none" stroke="currentColor" stroke-width="1.8" />
  <path d="M5 3v12h3" fill="none" stroke="currentColor" stroke-width="1.8" />
</svg>`;

const CHECK_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.1" />
</svg>`;

export class InstallPill extends Component {
  state = { copied: false, clipboardBlocked: false };

  copyResetTimer = null;

  init = async () => {
    this.onCleanup(() => {
      if (this.copyResetTimer) {
        clearTimeout(this.copyResetTimer);
      }
    });
  };

  copyInstallCommand = async () => {
    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      await this.setState({ copied: true, clipboardBlocked: false });
    } catch (error) {
      await this.setState({ copied: false, clipboardBlocked: true });
      return;
    }

    if (this.copyResetTimer) {
      clearTimeout(this.copyResetTimer);
    }

    this.copyResetTimer = setTimeout(() => {
      void this.setState({ copied: false });
    }, 1600);
  };

  render = async () => {
    const isCopied = this.state.copied;
    const iconMarkup = isCopied ? CHECK_ICON : COPY_ICON;
    const buttonLabel = this.state.clipboardBlocked ? "Clipboard unavailable" : "Copy install command";

    return createElement("div", { className: "install-pill" }, [
      createElement("code", { className: "mono install-command" }, INSTALL_COMMAND),
      createElement(
        "button",
        {
          type: "button",
          className: `copy-icon-btn${isCopied ? " copied" : ""}`,
          "aria-label": buttonLabel,
          title: buttonLabel,
        },
        iconMarkup,
        { type: "click", event: this.copyInstallCommand },
        { allowHtml: true },
      ),
    ]);
  };
}
