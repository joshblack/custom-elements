import { getId } from './unique-id';

class ListBoxElement extends HTMLElement {
  #activeOption: OptionElement | null;
  #selectedOption: OptionElement | null;

  constructor() {
    super();

    this.#activeOption = null;
    this.#selectedOption = null;
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
      if (!activeOption) {
        options[0]!.setAttribute('tabindex', '0');
      }

      const selectedOption = options.find((option) => {
        return option.getAttribute('aria-selected') === 'true';
      });
      if (selectedOption) {
        this.#selectedOption = selectedOption;
      }
    }

    this.addEventListener('keydown', this.onKeyDown);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this.onKeyDown);
  }

  selectOption(option: OptionElement) {
    if (this.#selectedOption) {
      this.#selectedOption.selected = false;
    }
    this.#selectedOption = option;
    this.#selectedOption.selected = true;
  }

  setActiveOption(option: OptionElement) {
    if (this.#activeOption) {
      this.#activeOption.active = false;
    }
    this.#activeOption = option;
    this.#activeOption.active = true;
    this.#activeOption.focus();
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();

      const options = this.getOptions();
      const activeIndex = options.findIndex((option) => {
        return option.getAttribute('tabindex') === '0';
      });
      // const nextIndex = (activeIndex + 1) % options.length;
      const nextIndex = Math.min(options.length, activeIndex + 1);
      const option = options[nextIndex];
      if (option) {
        this.setActiveOption(option);
      }
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();

      const options = this.getOptions();
      const activeIndex = options.findIndex((option) => {
        return option.getAttribute('tabindex') === '0';
      });
      // const nextIndex = (activeIndex - 1 + options.length) % options.length;
      const nextIndex = Math.max(0, activeIndex - 1);
      const option = options[nextIndex];
      if (option) {
        this.setActiveOption(option);
      }
    }

    if (event.key === 'Home') {
      event.preventDefault();
      event.stopPropagation();
      const options = this.getOptions();
      const [firstOption] = options;
      if (firstOption) {
        this.setActiveOption(firstOption);
      }
    }

    if (event.key === 'End') {
      event.preventDefault();
      event.stopPropagation();
      const options = this.getOptions();
      const lastOption = options[options.length - 1];
      if (lastOption) {
        this.setActiveOption(lastOption);
      }
    }
  };

  getOptions(): Array<OptionElement> {
    return Array.from(this.querySelectorAll('x-option'));
  }
}

class OptionElement extends HTMLElement {
  static get observedAttributes() {
    return ['active', 'disabled', 'selected'];
  }

  get active() {
    return this.hasAttribute('active');
  }

  set active(isActive) {
    if (isActive) {
      this.setAttribute('active', '');
      this.setAttribute('tabindex', '0');
    } else {
      this.removeAttribute('active');
      this.setAttribute('tabindex', '-1');
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

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(isDisabled) {
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

    if (this.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const listbox = this.getListBox();
    if (listbox && !this.disabled) {
      listbox.selectOption(this);
    }
  };

  onFocus = () => {
    const listbox = this.getListBox();
    if (listbox) {
      listbox.setActiveOption(this);
    }
  };

  onClick = () => {
    if (this.disabled) {
      return;
    }

    const listbox = this.getListBox();
    if (listbox) {
      listbox.selectOption(this);
    }
  };

  getListBox(): ListBoxElement | null {
    return this.closest('x-listbox');
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
  connectedCallback() {
    if (!this.hasAttribute('id')) {
      this.setAttribute('id', getId());
    }

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'presentation');
    }
  }
}

export { ListBoxElement, OptionElement, GroupElement, GroupLabelElement };
