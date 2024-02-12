class TabsElement extends HTMLElement {
  static get observedAttributes() {
    return ['activation'];
  }

  connectedCallback() {
    //
  }

  getTabList(): TabListElement | null {
    return this.querySelector('x-tablist');
  }

  getTab(index: number): TabElement | null {
    const tablist = this.getTabList();
    if (tablist) {
      const tabs = Array.from(
        tablist.querySelectorAll('x-tab'),
      ) as Array<TabElement>;
      return tabs[index] ?? null;
    }
    return null;
  }

  getPanels(): Array<TabPanelElement> {
    return Array.from(this.querySelectorAll('x-tabpanel'));
  }

  getPanelIndex(panel: TabPanelElement): number {
    const tabpanels = this.getPanels();
    return tabpanels.indexOf(panel);
  }
}

class TabListElement extends HTMLElement {
  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tablist');
    }
  }
}

class TabElement extends HTMLElement {
  static get observedAttributes() {
    return ['active', 'disabled', 'selected'];
  }

  get active() {
    return this.hasAttribute('active');
  }

  set active(isActive) {
    if (isActive) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(isDisabled) {
    if (isDisabled) {
      this.setAttribute('disabled', '');
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute('disabled');
      this.removeAttribute('aria-disabled');
    }
  }

  get selected() {
    return this.hasAttribute('selected');
  }

  set selected(isSelected) {
    if (isSelected) {
      this.setAttribute('selected', '');
      this.setAttribute('aria-selected', 'true');
    } else {
      this.removeAttribute('selected');
      this.setAttribute('aria-selected', 'false');
    }
  }

  connectedCallback() {
    const button = this.getButton();

    if (!button.hasAttribute('role')) {
      button.setAttribute('role', 'tab');
    }

    if (!button.hasAttribute('type')) {
      button.setAttribute('type', 'button');
    }

    if (!button.hasAttribute('aria-selected')) {
      button.setAttribute('aria-selected', 'false');
    }

    if (!button.hasAttribute('aria-controls')) {
      button.setAttribute('aria-controls', '');
    }

    if (!button.hasAttribute('id')) {
      button.setAttribute('id', '');
    }

    button.addEventListener('click', this.onClick);
    button.addEventListener('keydown', this.onKeyDown);
  }

  disconnectedCallback() {
    const button = this.getButton();
    button.removeEventListener('click', this.onClick);
    button.removeEventListener('keydown', this.onKeyDown);
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'active') {
      this.active = newValue === '';
    }

    if (name === 'selected') {
      this.selected = newValue === '';
    }

    if (name === 'disabled') {
      this.disabled = newValue === '';
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      //
    }

    if (event.key === 'ArrowRight') {
      //
    }

    if (event.key === 'Enter') {
      //
    }

    if (event.key === ' ') {
      //
    }
  };

  onClick = () => {
    //
  };

  getButton(): HTMLButtonElement {
    const button = this.querySelector('button');
    if (button) {
      return button as HTMLButtonElement;
    }
    throw new Error('x-tab requires a button element as a child');
  }

  getTabs(): TabsElement | null {
    return this.closest('x-tabs');
  }

  getTabList(): TabListElement | null {
    return this.closest('x-tablist');
  }
}

class TabPanelElement extends HTMLElement {
  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tabpanel');
    }

    if (!this.hasAttribute('id')) {
      this.setAttribute('id', '');
    }

    if (!this.hasAttribute('aria-labelledby')) {
      this.setAttribute('aria-labelledby', '');
    }
  }

  getTabs(): TabsElement | null {
    return this.closest('x-tabs');
  }

  getTabList(): TabListElement | null {
    const tabs = this.getTabs();
    return tabs?.querySelector('x-tablist') ?? null;
  }
}

export { TabsElement, TabListElement, TabElement, TabPanelElement };
