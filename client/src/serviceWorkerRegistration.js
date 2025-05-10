// This function checks if a new service worker is available and offers to update
function checkForUpdates(registration) {
  // When a new service worker is available, we can notify users to reload
  registration.addEventListener('updatefound', () => {
    // Get the installing service worker
    const newWorker = registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      // When the new service worker is installed (but waiting)
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // A new version is available and ready to be used
        if (window.confirm('A new version of this site is available. Reload to update?')) {
          // Tell the service worker to skipWaiting
          newWorker.postMessage({ type: 'SKIP_WAITING' });
          // Reload the page to activate the new service worker
          window.location.reload();
        }
      }
    });
  });
}

// Handle service worker updates
function handleServiceWorkerUpdates() {
  // Check for controller change
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Controller changed - reloading page');
  });
}

// Register the service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
        
        // Check for updates when registering
        checkForUpdates(registration);
        
        // Set up an interval to check for updates periodically
        setInterval(() => {
          registration.update().catch(err => {
            console.error('Error updating service worker:', err);
          });
        }, 60 * 60 * 1000); // Check for updates every hour
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
      
    handleServiceWorkerUpdates();
  });
}
