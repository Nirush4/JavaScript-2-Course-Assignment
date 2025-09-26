import postCard from '../components/posts/postCard';
import { getAllPosts } from '../services/posts/posts';
import type { Post } from '../types/noroff-types'; // Ensure Post type is defined

export default async function HomePage(): Promise<string> {
  let posts: Post[] = [];

  try {
    const result = await getAllPosts();

    if (Array.isArray(result)) {
      posts = result;
    } else if (result?.data && Array.isArray(result.data)) {
      posts = result.data;
    } else {
      console.warn('Unexpected result from getAllPosts:', result);
    }
  } catch (error) {
    console.error('Error loading posts:', error);
  }

  return `
   <div class="container fixed grid min-w-full grid-cols-5 min-h-dvh bg-gray-900">

      <div
        class="aside fixed bottom-0 right-0 left-0 z-30 flex justify-evenly items-center gap-5 h-15 w-full border-r-1 bg-blue-950 border-gray-300 bg-bg-light ... lg:hidden">
        <a href="" class="flex items-center w-12 h-12 pl-2">
          <img src="/public/logo.png" alt="Logo"> </a>
        <a href="" class="flex items-center hover:text-darkOrange">
          <i class="text-xl text-gray-200 cursor-pointer fa-solid fa-house-user"></i>
          <span class="text-xl cursor-pointer ps-4"></span>
        </a>
        <a href="" class="flex items-center hover:text-darkOrange">
          <i class="text-xl text-gray-200 cursor-pointer fa-solid fa-user"></i>
          <span class="text-xl cursor-pointer ps-4"></span>
        </a>
        <a href="" class="flex items-center hover:text-darkOrange">
          <i class="text-xl text-gray-200 cursor-pointer fa fa-camera"></i>
          <span class="text-xl cursor-pointer ps-4"></span>
        </a>
        <div class="flex items-center hover:text-darkOrange">
          <i class="text-xl text-gray-200 cursor-pointer fa-solid fa-bars"></i>
          <span class="text-xl cursor-pointer ps-4"></span>
        </div>
      </div>



      <div
        class="aside hidden lg:flex flex-col gap-15 h-full w-full border-r-1 border-gray-300 min-h-dvh bg-blue-1000 text-white ...">
        <a href="" class="flex items-center h-20 py-20 pl-10 w-55 shadow-white">
          <img src="/public/logo.png" alt="Logo" class="shadow-white"> </a>

        <a href="" class="flex items-center hover:text-darkOrange">
          <i class="text-xl text-gray-200 cursor-pointer fa-solid fa-house-user ps-12"></i>
          <span class="text-xl text-gray-200 cursor-pointer ps-4">Feed</span>
        </a>
        <div class="flex items-center hover:text-darkOrange">
          <i class="text-xl text-gray-200 cursor-pointer fa-solid fa-user ps-12"></i>
          <span class="text-xl text-gray-200 cursor-pointer ps-4">Profile</span>
        </div>
        <a href="" class="flex items-center hover:text-darkOrange">
          <i class="text-xl text-gray-200 cursor-pointer fa fa-camera ps-12"></i>
          <span class="text-xl text-gray-200 cursor-pointer ps-4">Create</span>
        </a>

        <div class="flex items-center hover:text-darkOrange">
          <i class="text-xl text-gray-200 cursor-pointer fa-solid fa-bars ps-12"></i>
          <span class="text-xl text-gray-200 cursor-pointer ps-4">More</span>
        </div>
      </div>

      <!-- imp! Right side container -->

      <div
        class="aside grid grid-rows-4 col-span-5 h-dvh w-full pt-20 px-5 place-items-center overflow-y-scroll ... bg-bg s:pt-10 s:px-10 lg:col-span-4 lg:px-0">
        <div class="flex flex-col items-center mt-10 top-container s:mt-10 md:mt-30 lg:mt-30">

          <div class="top flex justify-center gap-5 pb-5 max-w-3xl border-b-1 border-gray-600 ... s:gap-10 md:pb-12">
            <div class="text-center">
              <div
                class="mx-auto overflow-hidden border-2 border-blue-300 rounded-full w-25 h-25 hover:border-text-blue-500 s:border-4 s:w-30 s:h-30 md:w-40 md:h-40">
                <img id="profile-img" src="/public/profile.avif" alt="Profile Picture"
                  class="object-cover w-full h-full" />
              </div>


              <label for="file-input" class="block mt-4 text-blue-200 cursor-pointer">
                Change Profile Picture
              </label>
              <input type="file" id="file-input" class="hidden" accept="image/*" />
            </div>

            <div class="text-div">
              <div class="flex items-center mb-4 space-x-4 justify-self-start s:mt-5 ">
                <div class="text-xl font-medium text-gray-200 md:text-2xl">
                  <span id="profile-name">Tom Cruise</span>
                </div>

                <button id="edit-btn" class="text-blue-100 cursor-pointer hover:text-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 3l4 4-10 10H7v-4L17 3z"></path>
                  </svg>
                </button>
              </div>

              <div id="edit-section" class="hidden mb-4">
                <input type="text" id="name-input" class="w-full p-2 text-gray-200 border border-gray-300 rounded-md"
                  placeholder="Enter your name" />
                <div class="flex justify-between mt-4">
                  <button id="save-btn" class="px-4 py-2 text-gray-200 bg-gray-900 rounded-md hover:bg-blue-700">
                    Save
                  </button>
                  <button id="cancel-btn" class="px-4 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </div>

              <div class="post-followers-following flex flex-wrap gap-3 md:gap-10" id="profileMetrics"></div>

              <div class="flex items-center mt-10 mb-4 space-x-4 justify-self-start">
                <div class="text-gray-200 text-s font-small s:text-m md:text-lg">
                  <span id="bio-text">American actor and film producer</span>
                </div>

                <button id="edit-bio-btn" class="text-blue-100 cursor-pointer hover:text-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 3l4 4-10 10H7v-4L17 3z"></path>
                  </svg>
                </button>
              </div>

              <div id="edit-bio-section" class="hidden mb-4">
                <input type="text" id="bio-input" class="w-full p-2 text-gray-200 border border-gray-300 rounded-md"
                  placeholder="Enter your bio"></input>
                <div class="flex justify-between mt-4">
                  <button id="save-bio-btn" class="px-4 py-2 text-gray-200 bg-gray-900 rounded-md hover:bg-blue-700">
                    Save
                  </button>
                  <button id="cancel-bio-btn" class="px-4 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400">
                    Cancel
                  </button>

                </div>
              </div>
            </div>

          </div>

          <div class="flex justify-center posts-tagged gap-15">
            <div
              class="flex items-center justify-center gap-1 text-gray-200 uppercase cursor-pointer posts text-xs/10 text-md w-fit border-t-1 border-vibPink">
              <i class="fa-solid fa-image"></i>
              Posts
            </div>
            <div
              class="flex items-center justify-center gap-1 text-xs text-gray-200 uppercase cursor-pointer tagged text-md w-fit">
              <i class="fa-solid fa-people-arrows"></i>
              Tagged
            </div>
          </div>
        </div>

<div class="w-full mt-20 h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4  pr-10 pl-10 md:mt-60 place-items-start">
  ${posts.map((post, index) => postCard(post, index)).join('')}
</div>

      </div>
    </div>
`;
}

type FollowedUsers = string[];

// Setup follow buttons behavior
function setupFollowButtons(): void {
  // Load followed users from localStorage or initialize empty array
  let followedUsers: FollowedUsers = JSON.parse(
    localStorage.getItem('followedUsers') ?? '[]'
  );

  // Update buttons UI on page load
  document
    .querySelectorAll<HTMLButtonElement>('.follow-btn')
    .forEach((button) => {
      const authorId = button.dataset.authorid;
      if (!authorId) return;

      if (followedUsers.includes(authorId)) {
        button.textContent = 'Followed';
        button.classList.remove('bg-blue-500', 'hover:bg-blue-600');
        button.classList.add('bg-green-500', 'hover:bg-green-600');
        button.setAttribute('aria-label', `Unfollow @user${authorId}`);
      }
    });

  // Event delegation for follow button clicks
  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>('.follow-btn');
    if (!btn) return;

    const userId = btn.dataset.authorid;
    if (!userId) return;

    const isFollowed = followedUsers.includes(userId);

    if (isFollowed) {
      // Unfollow: remove from list
      followedUsers = followedUsers.filter((id) => id !== userId);
      btn.textContent = 'Follow';
      btn.classList.remove('bg-green-500', 'hover:bg-green-600');
      btn.classList.add('bg-blue-500', 'hover:bg-blue-600');
      btn.setAttribute('aria-label', `Follow @user${userId}`);
    } else {
      // Follow: add to list
      followedUsers.push(userId);
      btn.textContent = 'Followed';
      btn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
      btn.classList.add('bg-green-500', 'hover:bg-green-600');
      btn.setAttribute('aria-label', `Unfollow @user${userId}`);
    }

    // Save updated list to localStorage
    localStorage.setItem('followedUsers', JSON.stringify(followedUsers));
  });
}

// Run setup after DOM is loaded
document.addEventListener('DOMContentLoaded', setupFollowButtons);
