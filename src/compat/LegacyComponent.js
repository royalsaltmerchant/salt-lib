import { Component } from "../Component.js";

export class LegacyComponent extends Component {
  constructor(props = {}) {
    // Compat component keeps imperative render behavior for migration only.
    super({ ...props, legacyRender: true });
  }
}

export default LegacyComponent;
