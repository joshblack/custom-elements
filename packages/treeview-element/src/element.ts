// Events
// onChange
// onSelectItem
// onSelect

class TreeView extends HTMLElement {
  #activeItem: TreeItem | null = null;
  #selectedItem: TreeItem | null = null;
  #typeaheadText: string | null = null;
  #typeaheadTimeoutId: number | null = null;

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tree');
    }

    const items = this.getFocusableItems();
    if (items.length === 0) {
      return;
    }

    const selectedItem = items.find((item) => {
      return item.hasAttribute('selected');
    });
    if (selectedItem) {
      selectedItem.setAttribute('tabindex', '0');
    } else {
      const [firstItem] = items;
      firstItem!.setAttribute('tabindex', '0');
    }

    this.addEventListener('keydown', this.onKeyDown);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Home') {
      event.preventDefault();
      event.stopPropagation();

      this.setFirstItemAsActive();
    } else if (event.key === 'End') {
      event.preventDefault();
      event.stopPropagation();

      this.setLastItemAsActive();
    } else if (event.key === '*') {
      //
    } else {
      this.typeahead(event.key);
    }
  };

  getItems(): Array<TreeItem> {
    return Array.from(this.querySelectorAll('x-treeitem'));
  }

  getFocusableItems(): Array<TreeItem> {
    const items: Array<TreeItem> = [];

    for (const child of this.childNodes) {
      visit(child);
    }

    function visit(node: Node) {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      if (node instanceof TreeItem) {
        if (node.disabled) {
          return;
        }

        items.push(node);
        if (node.expanded) {
          for (const child of node.childNodes) {
            visit(child);
          }
        }
      } else {
        for (const child of node.childNodes) {
          visit(child);
        }
      }
    }

    return items;
  }

  selectItem(item: TreeItem) {
    if (this.#selectedItem) {
      this.#selectedItem.selected = false;
    }
    this.#selectedItem = item;
    this.#selectedItem.selected = true;
    this.setActiveItem(item);
    this.#selectedItem.focus();
  }

  setActiveItem(item: TreeItem) {
    if (this.#activeItem) {
      this.#activeItem.active = false;
    }
    this.#activeItem = item;
    this.#activeItem.active = true;
  }

  setNextItemAsActive(current: TreeItem) {
    const items = this.getFocusableItems();
    const currentIndex = items.indexOf(current);
    const nextIndex = Math.min(items.length - 1, currentIndex + 1);

    this.setActiveItem(items[nextIndex]!);
    this.#activeItem!.focus();
  }

  setPreviousItemAsActive(current: TreeItem) {
    const items = this.getFocusableItems();
    const currentIndex = items.indexOf(current);
    const previousIndex = Math.max(0, currentIndex - 1);

    this.setActiveItem(items[previousIndex]!);
    this.#activeItem!.focus();
  }

  setFirstItemAsActive() {
    const items = this.getFocusableItems();
    const [firstItem] = items;
    if (firstItem) {
      this.setActiveItem(firstItem);
      this.#activeItem!.focus();
    }
  }

  setLastItemAsActive() {
    const items = this.getFocusableItems();
    const lastItem = items[items.length - 1];
    if (lastItem) {
      this.setActiveItem(lastItem);
      this.#activeItem!.focus();
    }
  }

  typeahead(character: string) {
    if (this.#typeaheadTimeoutId !== null) {
      clearTimeout(this.#typeaheadTimeoutId);
      this.#typeaheadTimeoutId = null;
    }

    this.#typeaheadText =
      this.#typeaheadText === null
        ? character
        : this.#typeaheadText + character;
    this.#typeaheadTimeoutId = window.setTimeout(() => {
      this.focusItemMatchingTypeahead();
      this.#typeaheadText = null;
    }, 100);
  }

  focusItemMatchingTypeahead() {
    if (this.#typeaheadText === null) {
      return;
    }

    const typeahead = this.#typeaheadText.toLowerCase();
    const items = this.getFocusableItems();
    let activeItemIndex = items.findIndex((item) => {
      return item === this.#activeItem;
    });
    if (activeItemIndex === -1) {
      activeItemIndex = 0;
    }

    const ordered = [];
    let inserted = 0;

    while (inserted < items.length) {
      const index = (activeItemIndex + inserted) % items.length;
      ordered.push(items[index] as TreeItem);
      inserted++;
    }

    const match = ordered.find((item) => {
      return item.getTextContent().toLowerCase().includes(typeahead);
    });
    match?.focus();

    this.#typeaheadTimeoutId = null;
  }
}

class TreeItem extends HTMLElement {
  static get observedAttributes() {
    return ['active', 'disabled', 'expanded', 'selected'];
  }

  /**
   * Specifies if the item is currently expanded
   */
  public get active() {
    return this.hasAttribute('active');
  }

  public set active(isActive) {
    if (isActive) {
      this.setAttribute('active', '');
      this.setAttribute('tabindex', '0');
    } else {
      this.removeAttribute('active');
      this.setAttribute('tabindex', '-1');
    }
  }

  /**
   * Specifies if the item is currently disabled
   */
  public get disabled() {
    return this.hasAttribute('disabled');
  }

  public set disabled(isDisabled) {
    if (isDisabled) {
      this.setAttribute('disabled', '');
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute('disabled');
      this.setAttribute('aria-disabled', 'false');
    }
  }

  /**
   * Specifies if the item is currently expanded
   */
  public get expanded() {
    return this.hasAttribute('expanded');
  }

  public set expanded(isExpanded) {
    if (isExpanded) {
      this.setAttribute('expanded', '');
      this.setAttribute('aria-expanded', 'true');
    } else {
      this.removeAttribute('expanded');
      this.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Specifies if the item is currently selected
   */
  public get selected() {
    return this.hasAttribute('selected');
  }

  public set selected(isSelected) {
    if (isSelected) {
      this.setAttribute('selected', '');
      this.setAttribute('aria-selected', 'true');
    } else {
      this.removeAttribute('selected');
      this.setAttribute('aria-selected', 'false');
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'treeitem');
    }

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1');
    }

    if (!this.hasAttribute('aria-level')) {
      this.setAttribute('aria-level', '1');
    }

    this.expanded = this.isExpandable()
      ? this.getAttribute('expanded') === ''
      : false;
    this.selected = this.getAttribute('selected') === '';
    this.disabled = this.getAttribute('disabled') === '';

    this.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onKeyDown);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
    this.removeEventListener('keydown', this.onKeyDown);
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'expanded') {
      this.expanded = newValue !== null;
    }

    if (name === 'selected') {
      this.selected = newValue !== null;
    }
  }

  onClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    this.select();
    this.toggleExpand();
  };

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();

      const treeview = this.getTreeView();
      treeview?.setNextItemAsActive(this);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();

      const treeview = this.getTreeView();
      treeview?.setPreviousItemAsActive(this);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      this.collapse();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      this.expand();
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.select();
      this.toggleExpand();
    }

    if (event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      this.select();
      this.toggleExpand();
    }
  };

  isExpandable() {
    return this.querySelector(':not(x-treeitem) x-treeitemgroup') !== null;
  }

  toggleExpand() {
    if (!this.isExpandable()) {
      return;
    }

    this.expanded = !this.expanded;
  }

  select() {
    const treeview = this.getTreeView();
    treeview?.selectItem(this);
  }

  collapse() {
    if (this.expanded) {
      this.expanded = false;
    } else {
      // If we're not expandable, or we're already collapsed, shift focus to the
      // closest parent item
      const parentItem = this.getParentItem();
      parentItem?.focus();
    }
  }

  expand() {
    if (!this.isExpandable()) {
      return;
    }

    if (!this.expanded) {
      this.expanded = true;
    } else {
      // If we're already expanded, shift focus to the first child
      const firstChild = this.getFirstChildItem();
      firstChild?.focus();
    }
  }

  getTreeView(): TreeView | null {
    return this.closest('x-treeview');
  }

  getParentItem(): TreeItem | null {
    const item = this.parentElement?.closest('x-treeitem');
    if (item) {
      return item as TreeItem;
    }
    return null;
  }

  getFirstChildItem(): TreeItem | null {
    return this.querySelector('x-treeitem:not([disabled])');
  }

  getTextContent(): string {
    let textContent = '';
    for (const node of this.childNodes) {
      if (!(node instanceof TreeItemGroup)) {
        textContent += node.textContent;
      }
    }
    return textContent;
  }
}

class TreeItemGroup extends HTMLElement {
  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'group');
    }
  }
}

export { TreeView, TreeItem, TreeItemGroup };
