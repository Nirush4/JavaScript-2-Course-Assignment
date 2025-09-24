import "./style.css";


import { renderRoute } from "./router";
import {
  handleGlobalError,
  catchUnhandledRejection,
} from "./services/error/error";

// Render initial content based on the current path
renderRoute(window.location.pathname);

window.onerror = handleGlobalError;

window.addEventListener("unhandledrejection", catchUnhandledRejection);

// We need to listen to the browser changes
window.addEventListener("popstate", (event) => {
  // The 'event.state' object contains the state we pushed earlier.
  // If the state is null, it might be the initial page load.
  const path = event.state ? event.state.path : window.location.pathname;
  console.log(`Navigating to ${path} via popstate`);
  renderRoute(path);
});

// Need to check that the browser supports service workers
// if ("serviceWorker" in navigator) {
//   // Register our service worker file
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/sw.js")
//       .then((registration) => {
//         console.log("Service Worker registered successfully:", registration);
//       })
//       .catch((error) => {
//         console.log("Service Worker registration failed:", error);
//       });
//   });
// }

/**
 * Add event listeners to our links
 */
const linkEls: NodeListOf<HTMLAnchorElement> =
  document.querySelectorAll("#js-primary-nav a");

if (linkEls) {
  linkEls.forEach((link) => link.addEventListener("click", navigate));
}

function navigate(event: MouseEvent) {
  event.preventDefault();
  let path: string | null;

  const el = event?.target as HTMLAnchorElement;

  path = el.getAttribute("href");

  if (typeof path === "string") {
    // Change the URL in the address bar
    history.pushState({ path: path }, "", path);

    // Update the content based on the path
    renderRoute(path);
  }
}
