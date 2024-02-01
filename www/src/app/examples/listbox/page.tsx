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
  events: {
    onSelect: 'select',
  },
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
      <main>
        <h1>Listbox example</h1>
        <div id="field">Field</div>
        <ListBox
          aria-labelledby="field"
          className="flex flex-col border"
          onSelectOption={(event: SelectOptionEvent) => {
            console.log(event.detail);
          }}>
          <Option className="hover:bg-gray-100 cursor-pointer">First</Option>
          <Option className="hover:bg-gray-100 cursor-pointer">Second</Option>
          <Option className="hover:bg-gray-100 cursor-pointer">Third</Option>
          <Group className="flex flex-col">
            <GroupLabel>Group 1</GroupLabel>
            <Option className="hover:bg-gray-100 cursor-pointer">First</Option>
            <Option className="hover:bg-gray-100 cursor-pointer">Second</Option>
            <Option className="hover:bg-gray-100 cursor-pointer">Third</Option>
          </Group>
        </ListBox>
      </main>
    </>
  );
}
