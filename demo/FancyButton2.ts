import { css, html, LitElement } from 'lit';

export class FancyButton extends LitElement {
  static get styles() {
    return css`
      :host {
        font-family: monospace;
        position: relative;
        display: inline-block;
        background-color: black;
        color: #fff;
        font-weight: bold;
        padding: 0.5rem;
        border-radius: 4px;
      }
      button {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        border: 0;
        opacity: 0;
        outline: 0;
        background-color: #000;
      }
      :host(:focus),
      :host(:focus-visible) {
        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.5);
      }
      :host(:focus) button {
        opacity: 0.1;
      }
      :host(:active) button {
        opacity: 0.5;
      }
    `;
  }

  static get shadowRootOptions() {
    return { ...LitElement.shadowRootOptions, delegatesFocus: true };
  }

  render() {
    return html`<slot>fancy button 2</slot><button tabindex="0"></button>`;
  }
}
