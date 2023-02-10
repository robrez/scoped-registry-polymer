import { PolymerElement, html } from '@polymer/polymer';
import { ScopedRegistryMixin, ElementDefinitionsMap } from '../src/ScopedRegistryMixin.js';
import { FancyButton } from './FancyButton2.js';

class SampleElement extends ScopedRegistryMixin(PolymerElement) {
  static get properties() {
    return {
      count: Number
    };
  }

  constructor() {
    super();
    // @ts-ignore
    this.count = 0;
  }

  static get is() {
    return 'my-polymer-element';
  }

  static get scopedElements(): ElementDefinitionsMap {
    return {
      'fancy-button': FancyButton,
      'global-fancy-button': customElements.get('fancy-button') as typeof HTMLElement
    };
  }

  static get template() {
    return html`
      <style>
        :host {
          font-family: sans-serif;
          display: block;
          border: 1px solid #444;
          padding: 1rem;
          border-radius: 4px;
        }
        :host > div {
          margin-bottom: 1rem;
        }
      </style>

      <div>
        <h2>PolymerElement w/ Scoped Element Registry</h2>
      </div>
      <div>
        <fancy-button on-click="_onClick">Local Button</fancy-button>
        <p>This button was only registered locally</p>
      </div>
      <div>
        <global-fancy-button on-click="_onClick">Global Button</global-fancy-button>
        <p>This button was taken from the global registry and re-registered locally with a different name</p>
      </div>
      <div>
        <small>Clicks: [[count]]</small>
      </div>
    `;
  }

  _onClick(): void {
    // @ts-ignore
    this.count += 1;
    // @ts-ignore
    console.log('clicked!', this.count);
  }
}

if (!customElements.get(SampleElement.is)) {
  customElements.define(SampleElement.is, SampleElement);
}
