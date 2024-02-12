'use client';

import { useEffect } from 'react';
import {
  TreeItem,
  TreeItemGroup,
  TreeView,
} from '../../../../../packages/treeview-element/src';
import { canUseDOM } from '../../../environment';

if (canUseDOM) {
  import('../../../../../packages/treeview-element/src/define');
}

export default function TreeViewElement() {
  return (
    <>
      <x-treeview class="flex flex-col">
        <x-treeitem>Item 1</x-treeitem>
        <x-treeitem>Item 2</x-treeitem>
        <x-treeitem disabled="">Item 3</x-treeitem>
        <x-treeitem>Item 4</x-treeitem>
      </x-treeview>
    </>
  );
}
