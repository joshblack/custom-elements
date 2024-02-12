import { html } from 'lit';
import './define';
import './treeview-element.stories.css';

export default {
  title: 'Elements/TreeView',
};

export const Default = () => {
  return html`
    <x-treeview>
      <x-treeitem>
        <span class="treeitem-title">
          <span class="treeitem-expander"></span>
          Projects
        </span>
        <x-treeitemgroup>
          <x-treeitem>project-1.docx</x-treeitem>
          <x-treeitem>project-2.docx</x-treeitem>
          <x-treeitem>project-3.docx</x-treeitem>
        </x-treeitemgroup>
      </x-treeitem>
      <x-treeitem>
        <span class="treeitem-title">
          <span class="treeitem-expander"></span>
          Reports
        </span>
        <x-treeitemgroup>
          <x-treeitem>report-1.docx</x-treeitem>
          <x-treeitem>report-2.docx</x-treeitem>
          <x-treeitem>report-3.docx</x-treeitem>
        </x-treeitemgroup>
      </x-treeitem>
      <x-treeitem>
        <span class="treeitem-title">
          <span class="treeitem-expander"></span>
          Letters
        </span>
        <x-treeitemgroup>
          <x-treeitem>report-1.docx</x-treeitem>
          <x-treeitem>report-2.docx</x-treeitem>
          <x-treeitem>report-3.docx</x-treeitem>
        </x-treeitemgroup>
      </x-treeitem>
    </x-treeview>
  `;
};
