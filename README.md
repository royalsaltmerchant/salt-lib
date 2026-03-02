# salt-lib

Simple dynamic frontend rendering library.

## Install

```bash
npm install @royalsaltmerchant/salt-lib
```

## Exports

```js
import { Component, createElement } from "@royalsaltmerchant/salt-lib";
```

## Core Model

- `Component` owns one `domElem` root.
- `render()` always clears first, then appends returned output.
- `render()` can be async.
- If multiple async renders overlap, stale older renders are dropped.
- Compose nested classes with `useChild(key, factory, update?)` or `childElem(key, factory, update?)`.

## Component API

### Constructor

```js
new Component({
  domElem,      // optional mount element
  tagName,      // optional root tag if domElem not provided (default: "div")
  className,    // optional class for root
  state,        // optional initial state object
  autoInit,     // default: true
  autoRender,   // default: true
})
```

Mount rules:
- If `domElem` is provided, it is used.
- If not, a detached root is created.
- `salt-lib` does not auto-query `#app`.

Lifecycle rules:
- `autoInit` defaults to `true`.
- `autoRender` defaults to `true`.
- If a render already started before constructor auto-render runs (manual constructor render or `init()` render), auto-render is skipped to avoid duplicate first paint.

### Methods

- `async init()`
- `async render()`
- `useMemo(key, factoryOrValue, depsOrFactory = [])`
- `clearMemo(key?)`
- `useChild(key, factory, update?)`
- `async childElem(key, factory, update?)`
- `dropChild(key, { destroy = true })`
- `clearChildren({ destroy = true })`
- `async setState(nextStateOrUpdater, { replace = false, render = true })`
- `getState()`
- `onCleanup(fn)`
- `offCleanup(fn)`
- `runCleanup()`
- `clear({ deep = false })`
- `destroy({ clear = true, clearMemo = true, destroyChildren = true })`

## useChild / childElem Pattern

`useChild` caches one child instance per key.

`childElem` is shorthand for: get cached child -> run child render -> return `child.domElem`.

```js
import { Component, createElement } from "@royalsaltmerchant/salt-lib";

class CounterCard extends Component {
  render = async () => {
    return [
      createElement("article", { className: "card" }, [
        createElement("h2", {}, this.props.title),
        createElement("div", {}, String(this.props.count)),
      ]),
    ];
  };
}

class App extends Component {
  state = { count: 0, title: "Counter" };

  increment = async () => {
    await this.setState((prev) => ({ count: prev.count + 1 }));
  };

  renderCounterCard = async () => {
    return this.childElem(
      "counter-card",
      () =>
        new CounterCard({
          domElem: createElement("div"),
          autoInit: false,
          autoRender: false,
          title: this.state.title,
          count: this.state.count,
        }),
      (child) => {
        child.props.title = this.state.title;
        child.props.count = this.state.count;
      },
    );
  };

  render = async () => {
    const cardElem = await this.renderCounterCard();

    return [
      createElement("h1", {}, "salt-lib"),
      createElement(
        "button",
        { type: "button" },
        "+1",
        { type: "click", event: this.increment },
      ),
      cardElem,
    ];
  };
}

const root = document.getElementById("app");
if (!root) throw new Error("Missing #app");

new App({ domElem: root });
```

## createElement API

```js
createElement(tag, attributes, children, eventListeners, options)
```

### Attributes

- `className` maps to `class`.
- `style` supports object syntax.
- `dataset` supports object syntax.
- Boolean attrs follow HTML boolean semantics.

### Children

- Supports single child or nested arrays.
- Supports `Node`, string, number, and other primitives.
- `null`, `undefined`, and `false` are skipped.

### Event listeners

- Accepts one listener object or an array.

```js
{ type: "click", event: handler, options: { once: true } }
```

### Raw HTML (opt-in)

```js
createElement("div", {}, "<b>trusted html</b>", null, { allowHtml: true });
```

## Render Output Types

A `render()` return value can include:
- DOM nodes
- nested arrays of nodes
- strings / numbers
- component instances (their `domElem` is appended)

## Example App In Repo

Files:
- `examples/memo-child-state/index.html`
- `examples/memo-child-state/main.js`
- `examples/memo-child-state/style.css`

Run:

```bash
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173/examples/memo-child-state/
```

## Publish Checklist

1. Set package metadata in `package.json`:
   - `repository`
   - `bugs`
   - `homepage`
2. Run local validation:

```bash
npm test
npm run pack:check
```

3. Publish:

```bash
npm login
npm publish
```
