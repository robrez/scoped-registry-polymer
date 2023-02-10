import { FancyButton } from './FancyButton1.js';

if (!customElements.get('fancy-button')) {
  customElements.define('fancy-button', FancyButton);
}
