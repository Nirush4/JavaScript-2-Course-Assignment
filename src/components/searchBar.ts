import logoutBtn from '../components/logoutBtn';

export default function searchBar() {
  return `
    <div class="flex items-center justify-center w-full px-2 mb-2">
      <!-- Search input -->
      <input
        id="feed-search-input"
        type="text"
        placeholder="Search posts..."
        class="w-2/3 max-w-2xl border border-gray-600 rounded-lg px-3 py-2
               bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
 
      <!-- Reuse existing logout button -->
      <div class="ml-2">
        ${logoutBtn()}
      </div>
    </div>
  `;
}
