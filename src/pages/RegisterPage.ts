import { renderRoute } from '../router';
import { registerUser } from '../services/api/client.js'; // Assuming you have this
import { setLocalItem } from '../utils/storage.js';
import type { ApiResponse, RegisterResponse } from '../types/index.js';

export default async function RegisterPage() {
  setTimeout(() => {
    const form = document.getElementById('registerForm') as HTMLFormElement;
    if (form) {
      const submitBtn = form.querySelector(
        "button[type='submit']"
      ) as HTMLButtonElement;

      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nameInput = document.getElementById(
          'registerName'
        ) as HTMLInputElement;
        const emailInput = document.getElementById(
          'registerEmail'
        ) as HTMLInputElement;
        const passwordInput = document.getElementById(
          'registerPassword'
        ) as HTMLInputElement;
        const confirmPasswordInput = document.getElementById(
          'registerConfirmPassword'
        ) as HTMLInputElement;
        const formError = document.getElementById('registerMessage');

        if (
          !nameInput ||
          !emailInput ||
          !passwordInput ||
          !confirmPasswordInput
        ) {
          console.error('Form inputs not found');
          return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Reset previous messages
        if (formError) {
          formError.textContent = '';
          formError.style.color = 'red';
        }

        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
          if (formError)
            formError.textContent = 'Please fill in all the fields.';
          return;
        }

        if (!email.includes('@')) {
          if (formError)
            formError.textContent = 'Please enter a valid email address.';
          return;
        }

        if (!email.endsWith('@stud.noroff.no')) {
          if (formError)
            formError.textContent =
              'Please use your @stud.noroff.no email address.';
          return;
        }

        if (password.length < 8) {
          if (formError)
            formError.textContent =
              'Password must be at least 8 characters long.';
          return;
        }

        if (password !== confirmPassword) {
          if (formError) formError.textContent = 'Passwords do not match.';
          return;
        }

        // Disable form during submission
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '🔄 Registering...';
        }

        // Show loading screen during registration
        const loadingScreen = (window as any).loadingScreen;
        if (loadingScreen) {
          loadingScreen.showWithMessage('Registering...');
        }

        const registerData = { name, email, password };

        try {
          const result: ApiResponse<RegisterResponse> = await registerUser(
            registerData
          );

          if (result.errors && result.errors.length > 0) {
            const errorMessage =
              result.errors[0]?.message || 'Registration failed.';
            if (formError) {
              // Customize error messages based on the API response
              if (errorMessage.toLowerCase().includes('email')) {
                formError.textContent = '❌ Email address already in use.';
              } else {
                formError.textContent = `❌ ${errorMessage}`;
              }
            }
          } else if (result.data) {
            if (formError) {
              formError.style.color = 'green';
              formError.textContent =
                '✅ Registration successful! Redirecting to login page...';
            }

            // Optionally store user data or token if returned
            if (result.data.accessToken) {
              setLocalItem('accessToken', result.data.accessToken);
            }
            if (result.data.name) {
              setLocalItem('user', result.data.name);
            }

            // Redirect to login page after registration success
            setTimeout(() => {
              history.pushState({ path: '/login' }, '', '/login');
              renderRoute('/login');
            }, 1500);
          } else {
            if (formError) {
              formError.textContent = 'Unexpected response from server.';
            }
          }
        } catch (error) {
          console.error('Registration error:', error);
          if (formError) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
              formError.textContent =
                '🌐 Network error. Please check your internet connection and try again.';
            } else {
              formError.textContent =
                '⚠️ Something went wrong. Please try again in a moment.';
            }
          }
        } finally {
          // Hide loading screen
          if (loadingScreen) {
            loadingScreen.hideLoadingScreen();
          }
          // Re-enable form
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Register';
          }
        }
      });
    }

    // Attach event listener for login link
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({ path: '/login' }, '', '/login');
        renderRoute('/login');
      });
    }
  }, 0);

  return `
  <div class="page px-5 active flex items-center justify-center min-h-screen bg-gradient-to-br bg-green-900" id="registerPage">
    <div class="auth-container w-full max-w-md px-6 py-8 bg-green-500 rounded-xl shadow-lg">
      <div class="auth-card">
        <h1 class="text-3xl font-extrabold text-center text-green-700 mb-6">Create Account</h1>
        <div id="registerMessage" class="mb-4 text-center font-medium text-red-500"></div>
        <form id="registerForm" class="space-y-5">
          <div class="form-group">
            <label for="registerName" class="block mb-2 text-sm font-semibold text-gray-700">Full Name</label>
            <input type="text" id="registerName" required
              placeholder="Enter your full name"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
          </div>
          <div class="form-group">
            <label for="registerEmail" class="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
            <input type="email" id="registerEmail" required
              placeholder="Enter your @stud.noroff.no email"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
          </div>
          <div class="form-group">
            <label for="registerPassword" class="block mb-2 text-sm font-semibold text-gray-700">Password</label>
            <input type="password" id="registerPassword" required
              placeholder="Enter your password"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
          </div>
          <div class="form-group">
            <label for="registerConfirmPassword" class="block mb-2 text-sm font-semibold text-gray-700">Confirm Password</label>
            <input type="password" id="registerConfirmPassword" required
              placeholder="Confirm your password"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
          </div>
          <button type="submit"
            class="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2">
            <span>🚀</span> Register
          </button>
        </form>

        <div class="auth-links mt-6 text-center text-white text-sm">
          <p>
            Already have an account?
            <a href="#" id="login-link" class="font-medium underline">Login here</a>
          </p>
        </div>
      </div>
    </div>
  </div>
  `;
}
