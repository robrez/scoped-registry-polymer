# Scoped Elements for Polymer

A mixin for [Polymer](https://github.com/polymer/polymer) elements based on the [Scoped Custom Element Registry](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md) proposal

This mixin is inspired by the work of other which targets `Lit`

- [open-wc](https://www.npmjs.com/package/@open-wc/scoped-elements)
- [lit](https://www.npmjs.com/package/@lit-labs/scoped-registry-mixin)

## Usage

```ts
import { ScopedRegistryMixin } from '@robrez/scoped-registry-polymer';
import { html, PolymerElement } from '@polymer/polymer';

class FancyButton extends HTMLElement {
  /** */
}

export class MyElement extends ScopedRegistryMixin(PolymerElement) {
  static get scopedElements(): ElementDefinitionsMap {
    return {
      'fancy-button': FancyButton
    };
  }

  static get template() {
    return html`
      <div>
        <fancy-button>I am scoped!</fancy-button>
      </div>
    `;
  }
}
```

## Developing

```bash
# install deps
npm i

# compile
npm run build

# serve demos
npm run start

# run tests
npm run test
```

## TODO

- Downlevel types
- Nicer docs
