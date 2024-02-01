'use client';

import { createComponent } from '@lit/react';
import {
  GroupElement,
  GroupLabelElement,
  ListBoxElement,
  OptionElement,
  type SelectOptionEvent,
} from 'listbox-element';
import 'listbox-element/define';
import React from 'react';

const ListBox = createComponent({
  tagName: 'x-listbox',
  elementClass: ListBoxElement,
  react: React,
  events: {
    onSelectOption: 'selectoption',
    onActiveOption: 'activeoption',
  },
});

const Option = createComponent({
  tagName: 'x-option',
  elementClass: OptionElement,
  react: React,
});

const Group = createComponent({
  tagName: 'x-group',
  elementClass: GroupElement,
  react: React,
});

const GroupLabel = createComponent({
  tagName: 'x-group-label',
  elementClass: GroupLabelElement,
  react: React,
});

export default function listBoxExample() {
  return (
    <>
      <ListBox
        className="flex flex-col"
        onSelectOption={(event: SelectOptionEvent) => {
          console.log(event.detail);
        }}>
        <Option>First</Option>
        <Option>Second</Option>
        <Option>Third</Option>
        <Group className="flex flex-col">
          <GroupLabel>Group 1</GroupLabel>
          <Option>First</Option>
          <Option>Second</Option>
          <Option>Third</Option>
        </Group>
      </ListBox>
    </>
  );
}

// export default function ListBoxExample() {
// return (
// <>
// <style>{`
// x-listbox {
// display: flex;
// flex-direction: column;
// border-inline: 1px solid black;
// border-block-start: 1px solid black;
// }

// x-option {
// display: flex;
// padding: 0.5rem 0.25rem;
// border-block-end: 1px solid black;
// cursor: pointer;
// }

// x-group-label {
// border-block-end: 1px solid black;
// }

// x-option:hover {
// background-color: rgba(0, 0, 0, 0.075);
// }

// x-option::before {
// content: '';
// display: grid;
// place-items: center;
// width: 1rem;
// height: 1rem;
// }

// x-option[selected]::before {
// content: '✓';
// }

// x-option[disabled] {
// cursor: not-allowed;
// background-color: rgba(0, 0, 0, 0.1);
// }

// x-group-label {
// display: block;
// padding: 0.5rem calc(0.25rem + 1rem);
// background: rgba(0, 0, 0, 0.05);
// font-size:  0.75rem;
// font-weight: 600;
// text-transform: uppercase;
// }
// `}</style>
// <div id="label">Label</div>
// <x-listbox aria-labelledby="label">
// <x-option>First</x-option>
// <x-option>Second</x-option>
// <x-option disabled>Third</x-option>
// <x-option>Fourth</x-option>
// </x-listbox>
// <div id="label-2">Label</div>
// <x-listbox aria-labelledby="label-2">
// <x-group>
// <x-group-label>Group 1</x-group-label>
// <x-option>Group 1:A</x-option>
// <x-option>Group 1:B</x-option>
// <x-option>Group 1:C</x-option>
// <x-option>Group 1:D</x-option>
// </x-group>
// <x-group>
// <x-group-label>Group 2</x-group-label>
// <x-option>Group 2:A</x-option>
// <x-option>Group 2:B</x-option>
// <x-option>Group 2:C</x-option>
// <x-option>Group 2:D</x-option>
// </x-group>
// <x-group>
// <x-group-label>Group 3</x-group-label>
// <x-option>Group 2:A</x-option>
// <x-option>Group 2:B</x-option>
// <x-option>Group 2:C</x-option>
// <x-option>Group 2:D</x-option>
// </x-group>
// </x-listbox>
// </>
// );
// }
