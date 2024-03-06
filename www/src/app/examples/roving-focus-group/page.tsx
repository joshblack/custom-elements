'use client';

import { createComponent } from '@lit/react';
import React from 'react';
import { RovingFocusGroupElement } from 'roving-focus-group';

const RovingFocusGroup = createComponent({
  tagName: 'roving-focus-group',
  elementClass: RovingFocusGroupElement,
  react: React,
  events: {},
});

export default function RovingGroupElement() {
  return (
    <>
      <div className="w-full h-full flex flex-col items-center gap-y-4 p-4">
        <button>Before</button>
        <RovingFocusGroup className="flex gap-x-4" orientation="horizontal">
          <button tabIndex={0} className="bg-gray-300 px-3 py-1 rounded-xl">
            First
          </button>
          <button tabIndex={-1} className="bg-gray-300 px-3 py-1 rounded-xl">
            Second
          </button>
          <button
            disabled
            className="bg-gray-300 px-3 py-1 rounded-xl disabled:bg-gray-500 disabled:text-white">
            Disabled
          </button>
          <button tabIndex={-1} className="bg-gray-300 px-3 py-1 rounded-xl">
            Third
          </button>
        </RovingFocusGroup>
        <button>After</button>
      </div>
    </>
  );
}
