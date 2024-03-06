import { getId } from './unique-id';

interface ActiveOptionEvent {
  option: OptionElement;
}

interface SelectOptionEvent {
  option: OptionElement;
}

class ListboxChangeEvent extends Event {
  #activeOption: OptionElement | null;
  #selectedOption: OptionElement | null;

  constructor({
    activeOption,
    selectedOption,
    ...init
  }: EventInit & {
    selectedOption?: OptionElement;
    activeOption?: OptionElement;
  }) {
    super('listbox-change', {
      ...init,
      bubbles: true,
      composed: true,
    });
    this.#activeOption = activeOption ?? null;
    this.#selectedOption = selectedOption ?? null;
  }

  get activeOption() {
    return this.#activeOption;
  }

  get selectedOption() {
    return this.#selectedOption;
  }
}

class ListboxElement extends HTMLElement {
  static get observedAttributes() {
    return ['wrap'];
  }

  #activeOption: OptionElement | null;
  #selectedOption: OptionElement | null;

  constructor() {
    super();

    this.#activeOption = null;
    this.#selectedOption = null;
  }

  public get wrap() {
    return this.hasAttribute('wrap');
  }

  public set wrap(hasWrap) {
    if (hasWrap) {
      this.setAttribute('wrap', '');
    } else {
      this.removeAttribute('wrap');
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listbox');
    }

    const options = this.getOptions();
    if (options.length > 0) {
      const activeOption = options.find((option) => {
        return option.getAttribute('tabindex') === '0';
      });

      const selectedOption = options.find((option) => {
        return (
          option.getAttribute('aria-selected') === 'true' ||
          option.hasAttribute('selected')
        );
      });

      if (!selectedOption && !activeOption) {
        options[0]!.setAttribute('tabindex', '0');
      }

      if (selectedOption) {
        this.#selectedOption = selectedOption;
        selectedOption.setAttribute('tabindex', '0');
      }
    }

    this.addEventListener('keydown', this.onKeyDown);
  }

  disconnectedCallback() {
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

    if (name === 'wrap') {
      this.wrap = newValue !== null;
    }
  }

  selectOption(option: OptionElement) {
    if (this.#selectedOption) {
      this.#selectedOption.selected = false;
    }
    this.#selectedOption = option;
    this.#selectedOption.selected = true;

    this.dispatchEvent(
      new CustomEvent<SelectOptionEvent>('selectoption', {
        bubbles: true,
        detail: {
          option: this.#selectedOption,
        },
      }),
    );
  }

  setActiveOption(option: OptionElement) {
    if (this.#activeOption) {
      this.#activeOption.active = false;
    }
    this.#activeOption = option;
    this.#activeOption.active = true;
    this.#activeOption.focus();

    this.dispatchEvent(
      new CustomEvent<ActiveOptionEvent>('activeoption', {
        bubbles: true,
        detail: {
          option: this.#activeOption,
        },
      }),
    );
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();

      const options = this.getOptions();
      const activeIndex = options.findIndex((option) => {
        return option.getAttribute('tabindex') === '0';
      });
      const nextIndex = this.wrap
        ? (activeIndex + 1) % options.length
        : Math.min(options.length, activeIndex + 1);
      const option = options[nextIndex];
      if (option) {
        this.setActiveOption(option);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();

      const options = this.getOptions();
      const activeIndex = options.findIndex((option) => {
        return option.getAttribute('tabindex') === '0';
      });
      const nextIndex = this.wrap
        ? (activeIndex - 1 + options.length) % options.length
        : Math.max(0, activeIndex - 1);
      const option = options[nextIndex];
      if (option) {
        this.setActiveOption(option);
      }
    } else if (event.key === 'Home') {
      event.preventDefault();
      event.stopPropagation();
      const options = this.getOptions();
      const [firstOption] = options;
      if (firstOption) {
        this.setActiveOption(firstOption);
      }
    } else if (event.key === 'End') {
      event.preventDefault();
      event.stopPropagation();
      const options = this.getOptions();
      const lastOption = options[options.length - 1];
      if (lastOption) {
        this.setActiveOption(lastOption);
      }
    } else {
      // typeahad
    }
  };

  getOptions(): Array<OptionElement> {
    return Array.from(this.querySelectorAll('x-option'));
  }

  typeahead() {}
}

class OptionElement extends HTMLElement {
  static get observedAttributes() {
    return ['active', 'disabled', 'selected'];
  }

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

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'option');
    }

    if (this.hasAttribute('aria-selected')) {
      this.selected = this.getAttribute('aria-selected') === 'true';
    } else {
      this.selected = false;
    }

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1');
    }

    this.addEventListener('keydown', this.onKeyDown);
    this.addEventListener('focus', this.onFocus);
    this.addEventListener('click', this.onClick);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this.onKeyDown);
    this.removeEventListener('focus', this.onFocus);
    this.removeEventListener('click', this.onClick);
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (name === 'active') {
      if (oldValue !== newValue) {
        this.active = newValue === '';
      }
    }

    if (name === 'disabled') {
      if (oldValue !== newValue) {
        this.disabled = newValue === '';
      }
    }

    if (name === 'selected') {
      if (oldValue !== newValue) {
        this.selected = newValue === '';
      }
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }

    if (!this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      this.select();
    }
  };

  onFocus = () => {
    const listbox = this.getListBox();
    if (listbox) {
      listbox.setActiveOption(this);
    }
  };

  onClick = () => {
    if (!this.disabled) {
      this.select();
    }
  };

  getListBox(): ListboxElement | null {
    return this.closest('x-listbox');
  }

  select() {
    const listbox = this.getListBox();
    if (listbox) {
      listbox.selectOption(this);
    }
    this.dispatchEvent(
      new CustomEvent<SelectOptionEvent>('select', {
        detail: {
          option: this,
        },
      }),
    );
  }
}

class GroupElement extends HTMLElement {
  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'group');
    }

    const label = this.querySelector('x-group-label');
    if (!label) {
      throw new Error('x-group requires x-group-label');
    }

    if (!label.hasAttribute('id')) {
      label.setAttribute('id', getId());
    }
    const id = label.getAttribute('id')!;
    this.setAttribute('aria-labelledby', id);
  }
}

class GroupLabelElement extends HTMLElement {
  static get observedAttributes() {
    return ['id'];
  }

  connectedCallback() {
    if (!this.hasAttribute('id')) {
      this.setAttribute('id', getId());
    }

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'presentation');
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'id') {
      const group = this.getGroup();
      if (newValue !== null) {
        this.setAttribute('id', newValue);
        group?.setAttribute('aria-labelledby', newValue);
      } else {
        const id = getId();
        this.setAttribute('id', id);
        group?.setAttribute('aria-labelledby', id);
      }
    }
  }

  getGroup(): GroupElement | null {
    return this.closest('x-group');
  }
}

export { ListboxElement, OptionElement, GroupElement, GroupLabelElement };
export type { ActiveOptionEvent, SelectOptionEvent };
