import { initProfileView } from './view';

export function ProfilePage(): string {
	return `
    <section id="profile-page" class="mx-auto max-w-4xl p-4 md:p-6 space-y-6">
      <div class="flex flex-wrap items-center gap-2 justify-between">
        <div class="flex items-center gap-2">
          <input id="profile-handle" placeholder="Enter handle (e.g. voodoo)" class="px-3 py-2 rounded-xl border w-64" />
          <button id="btn-load-profile" type="button" class="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 transition">
            Load profile
          </button>
        </div>
        <button id="btn-load-demo" type="button" class="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition">
          Load demo (VooDoo)
        </button>
      </div>
      <section id="profile-root" class="space-y-6"></section>
    </section>
  `;
}

export const mountProfilePage = () => initProfileView();
