// import { screen } from '@testing-library/dom';
// import userEvent from '@testing-library/user-event';
// import { afterEach, describe, expect, test } from 'vitest';
// import '../define';

// const containers = new Set<HTMLElement>();

// function render(html: string) {
  // const container = document.createElement('div');

  // containers.add(container);
  // container.innerHTML = html;
  // document.body.appendChild(container);

  // return { container };
// }

// afterEach(() => {
  // for (const container of containers) {
    // document.body.removeChild(container);
    // containers.delete(container);
  // }
// });

// describe('ListBoxElement', () => {
  // test('setup', async () => {
    // const user = userEvent.setup();

    // render(`
      // <x-listbox>
        // <x-option>First</x-option>
        // <x-option>Second</x-option>
        // <x-option>Third</x-option>
      // </x-listbox>
    // `);

    // await user.tab();
    // expect(screen.getByText('First')).toHaveFocus();
  // });

  // test('arrow down moves focus', async () => {
    // const user = userEvent.setup();

    // render(`
      // <x-listbox>
        // <x-option>First</x-option>
        // <x-option>Second</x-option>
        // <x-option>Third</x-option>
      // </x-listbox>
    // `);

    // await user.tab();
    // expect(screen.getByText('First')).toHaveFocus();
    // await user.type(document.activeElement!, '{arrowdown}');
    // expect(screen.getByText('Second')).toHaveFocus();
    // await user.type(document.activeElement!, '{arrowdown}');
    // expect(screen.getByText('Third')).toHaveFocus();

    // // It should not wrap without `wrap` being true
    // await user.type(document.activeElement!, '{arrowdown}');
    // expect(screen.getByText('Third')).toHaveFocus();
  // });

  // test('arrow up moves focus', async () => {
    // const user = userEvent.setup();

    // render(`
      // <x-listbox>
        // <x-option>First</x-option>
        // <x-option>Second</x-option>
        // <x-option>Third</x-option>
      // </x-listbox>
    // `);

    // await user.tab();
    // await user.type(document.activeElement!, '{arrowdown}');
    // await user.type(document.activeElement!, '{arrowdown}');
    // await user.type(document.activeElement!, '{arrowdown}');

    // expect(screen.getByText('Third')).toHaveFocus();

    // await user.type(document.activeElement!, '{arrowup}');
    // expect(screen.getByText('Second')).toHaveFocus();

    // await user.type(document.activeElement!, '{arrowup}');
    // expect(screen.getByText('First')).toHaveFocus();

    // // It should not wrap without `wrap` being true
    // await user.type(document.activeElement!, '{arrowup}');
    // expect(screen.getByText('First')).toHaveFocus();
  // });

  // test('home moves focus to first item', async () => {
    // const user = userEvent.setup();

    // render(`
      // <x-listbox>
        // <x-option>First</x-option>
        // <x-option>Second</x-option>
        // <x-option>Third</x-option>
      // </x-listbox>
    // `);

    // await user.tab();
    // await user.type(document.activeElement!, '{arrowdown}');
    // await user.type(document.activeElement!, '{arrowdown}');
    // await user.type(document.activeElement!, '{arrowdown}');

    // expect(screen.getByText('Third')).toHaveFocus();

    // await user.type(document.activeElement!, '{home}');
    // expect(screen.getByText('First')).toHaveFocus();
  // });

  // test('end moves focus to last item', async () => {
    // const user = userEvent.setup();

    // render(`
      // <x-listbox>
        // <x-option>First</x-option>
        // <x-option>Second</x-option>
        // <x-option>Third</x-option>
      // </x-listbox>
    // `);

    // await user.tab();
    // expect(screen.getByText('First')).toHaveFocus();

    // await user.type(document.activeElement!, '{end}');
    // expect(screen.getByText('Third')).toHaveFocus();
  // });
// });
