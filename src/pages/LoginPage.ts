import { renderRoute } from '../router';
import { loginUser, fetchApiKey } from '../services/api/client.js';
import { setLocalItem } from '../utils/storage.js';
import type {
  LoginCredentials,
  ApiResponse,
  LoginResponse,
} from '../types/index.js';

export default async function LoginPage() {
  setTimeout(() => {
    const form = document.getElementById('loginForm') as HTMLFormElement;
    if (form) {
      const submitBtn = form.querySelector(
        "button[type='submit']"
      ) as HTMLButtonElement;

      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const emailInput = document.getElementById(
          'loginEmail'
        ) as HTMLInputElement;
        const passwordInput = document.getElementById(
          'loginPassword'
        ) as HTMLInputElement;
        const formError = document.getElementById('loginMessage');

        if (!emailInput || !passwordInput) {
          console.error('Form inputs not found');
          return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Reset previous messages
        if (formError) {
          formError.textContent = '';
          formError.style.color = 'red';
        }

        // Enhanced validation with specific error messages
        if (!email && !password) {
          if (formError)
            formError.textContent = 'Please enter both email and password.';
          return;
        }

        if (!email) {
          if (formError)
            formError.textContent = 'Please enter your email address.';
          return;
        }

        if (!password) {
          if (formError) formError.textContent = 'Please enter your password.';
          return;
        }

        // Email format validation
        if (!email.includes('@')) {
          if (formError)
            formError.textContent = 'Please enter a valid email address.';
          return;
        }

        // Noroff email validation
        if (!email.endsWith('@stud.noroff.no')) {
          if (formError)
            formError.textContent =
              'Please use your @stud.noroff.no email address.';
          return;
        }

        // Password length validation
        if (password.length < 8) {
          if (formError)
            formError.textContent =
              'Password must be at least 8 characters long.';
          return;
        }

        // Disable form during submission
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '🔄 Signing In...';
        }

        // Show loading screen during authentication
        const loadingScreen = (window as any).loadingScreen;
        if (loadingScreen) {
          loadingScreen.showWithMessage('Authenticating...');
        }

        const loginData: LoginCredentials = { email, password };

        try {
          console.log('Attempting login with:', { email });
          const result: ApiResponse<LoginResponse> = await loginUser(loginData);

          if (result.errors && result.errors.length > 0) {
            // Handle API errors with specific messages
            const errorMessage = result.errors[0]?.message || 'Login failed.';

            if (formError) {
              // Provide more specific error messages based on API response
              if (errorMessage.toLowerCase().includes('email')) {
                formError.textContent =
                  '❌ Email address not found. Please check your email or register for an account.';
              } else if (errorMessage.toLowerCase().includes('password')) {
                formError.textContent =
                  '❌ Incorrect password. Please check your password and try again.';
              } else if (
                errorMessage.toLowerCase().includes('user') &&
                errorMessage.toLowerCase().includes('not')
              ) {
                formError.textContent =
                  '❌ No account found with this email. Please register first.';
              } else if (errorMessage.toLowerCase().includes('invalid')) {
                formError.textContent =
                  '❌ Invalid login credentials. Please check your email and password.';
              } else if (errorMessage.toLowerCase().includes('credentials')) {
                formError.textContent =
                  '❌ Invalid email or password. Please double-check your credentials.';
              } else {
                // Show the original API error message if we can't categorize it
                formError.textContent = `❌ ${errorMessage}`;
              }
            }
          } else if (result.data) {
            // Successful login
            const { accessToken, name } = result.data;

            if (accessToken) {
              setLocalItem('accessToken', accessToken);
            }
            if (name) {
              setLocalItem('user', name);
            }

            // Try to get API key
            try {
              const apikey = await fetchApiKey(accessToken);
              if (apikey) {
                setLocalItem('apiKey', apikey);
              }
            } catch (apiError) {
              console.warn('Failed to get API key:', apiError);
              // Continue anyway - API key is optional for basic functionality
            }

            // Show success message
            if (formError) {
              formError.style.color = 'green';
              formError.textContent =
                '✅ Login successful! Redirecting to your dashboard...';
            }

            // Refresh navbar to show logout button
            if (typeof (window as any).refreshNavbar === 'function') {
              (window as any).refreshNavbar();
            }

            // Redirect to feed page after successful login
            setTimeout(() => {
              history.pushState({ path: '/feed' }, '', '/feed');
              renderRoute('/feed');
            }, 1500);

            // Redirect to home page
            setTimeout(() => {
              history.pushState({ path: '/' }, '', '/');
              renderRoute('/');
            }, 1500);
          } else {
            // Unexpected response format
            if (formError) {
              formError.textContent = 'Unexpected response from server.';
            }
          }
        } catch (error) {
          console.error('Login error:', error);
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
          const loadingScreen = (window as any).loadingScreen;
          if (loadingScreen) {
            loadingScreen.hideLoadingScreen();
          }

          // Re-enable form
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Sign In';
          }
        }
      });
    }

    // Handle register link
    const registerLink = document.getElementById('register-link');
    if (registerLink) {
      registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({ path: '/register' }, '', '/register');
        renderRoute('/register');
      });
    }
  }, 0);

  return `
   <div class="page active flex items-center justify-center min-h-screen bg-gradient-to-br bg-blue-900" id="loginPage">
  <div class="auth-container w-full max-w-md px-6 py-8 bg-blue-500 rounded-xl shadow-lg">
    <div class="auth-card">
      <h1 class="text-3xl font-extrabold text-center text-indigo-700 mb-6">Welcome Back</h1>
      <div id="loginMessage" class="mb-4 text-center font-medium text-red-500"></div>
      <form id="loginForm" class="space-y-5">
        <div class="form-group">
          <label for="loginEmail" class="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
          <input type="email" id="loginEmail" required
            placeholder="Enter your @stud.noroff.no email"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
        </div>
        <div class="form-group">
          <label for="loginPassword" class="block mb-2 text-sm font-semibold text-gray-700">Password</label>
          <input type="password" id="loginPassword" required
            placeholder="Enter your password"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
        </div>
        <button type="submit"
          class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition flex items-center justify-center gap-2">
          <span>🚀</span> Sign In
        </button>
      </form>

      <div
        class="login-tips mt-6 p-4 rounded-lg border border-indigo-300 bg-indigo-50 text-indigo-700 text-sm leading-relaxed">
        <div class="font-semibold mb-2 flex items-center gap-2">
          <span>💡</span> Login Tips:
        </div>
        <ul class="list-disc list-inside text-indigo-600">
          <li>Use your @stud.noroff.no email address</li>
          <li>Password must be at least 8 characters</li>
          <li>Make sure you've registered an account first</li>
        </ul>
      </div>

      <div class="auth-links mt-6 text-center text-black text-sm">
        <p class="text-black-900 text-m">
          Don't have an account?
          <a href="#" id="register-link" class=" text-white font-medium">Create one here</a>
        </p>
      </div>
    </div>
  </div>
</div>

  `;
}
