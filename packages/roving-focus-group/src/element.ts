class RovingFocusGroupElement extends HTMLElement {
  get wrap() {
    return this.hasAttribute('wrap');
  }

  set wrap(isWrapped) {
    if (isWrapped) {
      this.setAttribute('wrap', '');
    } else {
      this.removeAttribute('wrap');
    }
  }

  get orientation() {
    return this.getAttribute('orientation');
  }

  set orientation(newOrientation) {
    if (newOrientation) {
      this.setAttribute('orientation', newOrientation);
      this.setAttribute('aria-orientation', newOrientation);
    } else {
      this.removeAttribute('orientation');
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('wrap')) {
      this.wrap = false;
    }

    if (!this.hasAttribute('orientation')) {
      this.orientation = 'horizontal';
    }

    this.addEventListener('keydown', this.onKeyDown);
    this.setInitialActiveElement();

    // Note: do we need a mutation observer for when elements are added and
    // removed?
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Home') {
      event.preventDefault();
      this.focusFirstElement();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.focusLastElement();
      return;
    }

    if (this.orientation === 'horizontal') {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.focusPreviousElement();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.focusNextElement();
      }
      return;
    }

    if (this.orientation === 'vertical') {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.focusPreviousElement();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focusNextElement();
      }
      return;
    }
  };

  setInitialActiveElement() {
    const elements = getFocusableElements(this);
    const elementHasActiveIndex = elements.findIndex((element) => {
      return element.getAttribute('tabindex') === '0';
    });

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]!;
      if (elementHasActiveIndex !== -1 && elementHasActiveIndex === i) {
        continue;
      }

      if (elementHasActiveIndex === -1 && i === 0) {
        element.setAttribute('tabindex', '0');
      } else {
        element.setAttribute('tabindex', '-1');
      }
    }
  }

  focusNextElement() {
    const elements = getFocusableElements(this);
    const activeIndex = elements.findIndex((element) => {
      return element === getActiveElement();
    });

    // If the activeElement is not contained within the roving-focus-group then
    // we should not attempt to move focus
    if (activeIndex === -1) {
      return;
    }

    const nextActiveIndex = this.wrap
      ? (activeIndex + 1) % elements.length
      : Math.min(activeIndex + 1, elements.length - 1);

    if (elements[nextActiveIndex]) {
      elements[activeIndex]!.setAttribute('tabindex', '-1');
      elements[nextActiveIndex]!.setAttribute('tabindex', '0');
      elements[nextActiveIndex]!.focus();
    }
  }

  focusPreviousElement() {
    const elements = getFocusableElements(this);
    const activeIndex = elements.findIndex((element) => {
      return element === getActiveElement();
    });

    // If the activeElement is not contained within the roving-focus-group then
    // we should not attempt to move focus
    if (activeIndex === -1) {
      return;
    }

    const nextActiveIndex = this.wrap
      ? (elements.length + activeIndex - 1) % elements.length
      : Math.max(activeIndex - 1, 0);

    if (elements[nextActiveIndex]) {
      elements[activeIndex]!.setAttribute('tabindex', '-1');
      elements[nextActiveIndex]!.setAttribute('tabindex', '0');
      elements[nextActiveIndex]!.focus();
    }
  }

  focusFirstElement() {
    const elements = getFocusableElements(this);
    const activeIndex = elements.findIndex((element) => {
      return element === getActiveElement();
    });

    // If the activeElement is not contained within the roving-focus-group then
    // we should not attempt to move focus
    if (activeIndex === -1) {
      return;
    }

    const nextActiveIndex = 0;

    if (elements[nextActiveIndex]) {
      elements[activeIndex]!.setAttribute('tabindex', '-1');
      elements[nextActiveIndex]!.setAttribute('tabindex', '0');
      elements[nextActiveIndex]!.focus();
    }
  }

  focusLastElement() {
    const elements = getFocusableElements(this);
    const activeIndex = elements.findIndex((element) => {
      return element === getActiveElement();
    });

    // If the activeElement is not contained within the roving-focus-group then
    // we should not attempt to move focus
    if (activeIndex === -1) {
      return;
    }

    const nextActiveIndex = elements.length - 1;

    if (elements[nextActiveIndex]) {
      elements[activeIndex]!.setAttribute('tabindex', '-1');
      elements[nextActiveIndex]!.setAttribute('tabindex', '0');
      elements[nextActiveIndex]!.focus();
    }
  }
}

function getFocusableElements(root: HTMLElement): Array<HTMLElement> {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node: HTMLElement) {
      if (isFocusable(node)) {
        return NodeFilter.FILTER_ACCEPT;
      }

      if (!canHaveFocusableChildren(node)) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_SKIP;
    },
  });

  const elements: Array<HTMLElement> = [];
  let node = null;
  while ((node = walker.nextNode())) {
    elements.push(node as HTMLElement);
  }

  return elements;
}

/**
 * The work below comes from the awesome a11y-dialog
 *
 * @see https://github.com/KittyGiraudel/a11y-dialog/blob/9d603886f91ca3451d02ba665795d694e60c9ba9/src/dom-utils.ts
 */

const not = {
  inert: ':not([inert]):not([inert] *)',
  negTabIndex: ':not([tabindex^="-"])',
  disabled: ':not(:disabled)',
};

const focusableSelectors = [
  `a[href]${not.inert}`,
  `area[href]${not.inert}`,
  `input:not([type="hidden"]):not([type="radio"])${not.inert}${not.disabled}`,
  `input[type="radio"]${not.inert}${not.disabled}`,
  `select${not.inert}${not.disabled}`,
  `textarea${not.inert}${not.disabled}`,
  `button${not.inert}${not.disabled}`,
  `details${not.inert} > summary:first-of-type`,
  `iframe${not.inert}${not.negTabIndex}`,
  `audio[controls]${not.inert}`,
  `video[controls]${not.inert}`,
  `[contenteditable]${not.inert}`,
  `[tabindex]${not.inert}`,
];

/**
 * Determine if an element is focusable and has user-visible painted dimensions.
 */
const isFocusable = (el: HTMLElement) => {
  // A shadow host that delegates focus will never directly receive focus,
  // even with `tabindex=0`. Consider our <fancy-button> custom element, which
  // delegates focus to its shadow button:
  //
  // <fancy-button tabindex="0">
  //  #shadow-root
  //  <button><slot></slot></button>
  // </fancy-button>
  //
  // The browser acts as as if there is only one focusable element – the shadow
  // button. Our library should behave the same way.
  if (el.shadowRoot?.delegatesFocus) return false;

  return el.matches(focusableSelectors.join(',')) && !isHidden(el);
};

/**
 * Determine if an element is hidden from the user.
 */
const isHidden = (el: HTMLElement) => {
  // Browsers hide all non-<summary> descendants of closed <details> elements
  // from user interaction, but those non-<summary> elements may still match our
  // focusable-selectors and may still have dimensions, so we need a special
  // case to ignore them.
  if (
    el.matches('details:not([open]) *') &&
    !el.matches('details>summary:first-of-type')
  )
    return true;

  // If this element has no painted dimensions, it's hidden.
  return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
};

/**
 * Determine if an element can have focusable children. Useful for bailing out
 * early when walking the DOM tree.
 * @example
 * This div is inert, so none of its children can be focused, even though they
 * meet our criteria for what is focusable. Once we check the div, we can skip
 * the rest of the subtree.
 * ```html
 * <div inert>
 *   <button>Button</button>
 *   <a href="#">Link</a>
 * </div>
 * ```
 */
function canHaveFocusableChildren(el: HTMLElement) {
  // The browser will never send focus into a Shadow DOM if the host element
  // has a negative tabindex. This applies to both slotted Light DOM Shadow DOM
  // children
  if (el.shadowRoot && el.getAttribute('tabindex') === '-1') return false;

  // Elemments matching this selector are either hidden entirely from the user,
  // or are visible but unavailable for interaction. Their descentants can never
  // receive focus.
  return !el.matches(':disabled,[hidden],[inert]');
}

/**
 * Get the active element, accounting for Shadow DOM subtrees.
 * @author Cory LaViska
 * @see: https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
 */
export function getActiveElement(
  root: Document | ShadowRoot = document,
): Element | null {
  const activeEl = root.activeElement;

  if (!activeEl) return null;

  // If there’s a shadow root, recursively find the active element within it.
  // If the recursive call returns null, return the active element
  // of the top-level Document.
  if (activeEl.shadowRoot)
    return getActiveElement(activeEl.shadowRoot) || document.activeElement;

  // If not, we can just return the active element
  return activeEl;
}

export { RovingFocusGroupElement };
