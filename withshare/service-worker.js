
  const CACHE_NAME = 'melindaai-cache-v1';
const urlsToCache = [
  './',
  './index.html',

  './icons/android-chrome-192x192.png',
  './icons/android-chrome-512x512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32x32.png',
  './icons/favicon-16x16.png',
  './icons/mstile-150x150.png',
  './icons/safari-pinned-tab.svg',
  // Add any other assets you want to cache
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(keyList.map(key => {
        if (!cacheWhitelist.includes(key)) {
          return caches.delete(key);
        }
      }))
    )
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'TRANSCRIBE_FILE') {
    handleShareTarget(event.data.files);
  }
});

async function handleShareTarget(files) {
  for (const file of files) {
    // Post a message to the client to start the transcription process
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'TRANSCRIBE_FILE',
          file: file
        });
      });
    });
  }
}
