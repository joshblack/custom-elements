import { RovingFocusGroupElement } from './element';

declare global {
  interface HTMLElementTagNameMap {
    'roving-focus-group': RovingFocusGroupElement;
  }
}

customElements.define('roving-focus-group', RovingFocusGroupElement);
