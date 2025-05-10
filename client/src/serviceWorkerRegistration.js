if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").then(
      (registration) => {
        console.log("ServiceWorker registration successful:", registration);
      },
      (err) => {
        console.error("ServiceWorker registration failed:", err);
      }
    );
  });
}
