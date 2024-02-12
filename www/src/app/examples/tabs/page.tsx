export default function TabsPage() {
  return (
    <>
      <x-tabs>
        <x-tablist>
          <x-tab>
            <button type="button">One</button>
          </x-tab>
          <x-tab>
            <button type="button">One</button>
          </x-tab>
          <x-tab>
            <button type="button">One</button>
          </x-tab>
          <x-tab>
            <button type="button">One</button>
          </x-tab>
        </x-tablist>
        <x-tabpanel></x-tabpanel>
        <x-tabpanel></x-tabpanel>
        <x-tabpanel></x-tabpanel>
        <x-tabpanel></x-tabpanel>
      </x-tabs>
    </>
  );
}
