import { debounce } from '../utils/debounce';
import { initLogoutBtn } from '../components/logoutBtn';
import searchBar from '../components/searchBar';

export default function initFeedPageScripts() {
  console.log('initFeedPageScripts running...');

  // Select the main feed container (where profile + posts live)
  const mainContainer = document.querySelector(
    '.aside.grid.grid-rows-4.col-span-5'
  ) as HTMLElement | null;

  // Inject search bar + logout button row at the very top
  if (mainContainer && !document.getElementById('feed-search-input')) {
    mainContainer.insertAdjacentHTML('afterbegin', searchBar());

    // ✅ attach logout logic to the relocated button
    initLogoutBtn();
  }

  const searchInput = document.getElementById(
    'feed-search-input'
  ) as HTMLInputElement | null;

  const feedGrid = document.querySelector(
    '.w-full.mt-20.h-full.grid'
  ) as HTMLElement | null;

  if (!searchInput || !feedGrid) {
    console.warn('Search bar or feed grid not ready yet.');
    return;
  }

  // 🔎 Debounced filtering logic
  const filterPosts = debounce(() => {
    const query = searchInput.value.toLowerCase();
    const posts = feedGrid.querySelectorAll<HTMLElement>(
      "article[data-component='postCard']"
    );

    let matches = 0;
    posts.forEach((post) => {
      const title = post.querySelector('h2')?.textContent?.toLowerCase() || '';
      if (title.includes(query)) {
        post.style.display = '';
        matches++;
      } else {
        post.style.display = 'none';
      }
    });

    // Show/hide "no results" message
    let noResults = document.getElementById('no-results-message');
    if (!noResults) {
      noResults = document.createElement('p');
      noResults.id = 'no-results-message';
      noResults.textContent = 'No posts found.';
      feedGrid.parentElement?.appendChild(noResults);
    }
    noResults.style.display = matches === 0 ? '' : 'none';
  }, 300);

  searchInput.addEventListener('input', filterPosts);
}
