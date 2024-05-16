self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('melindaai-transcriber-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/script.js',
                '/manifest.json',
                'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['melindaai-transcriber-cache'];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method === 'POST' && event.request.url.includes('/share-target')) {
        event.respondWith(
            (async () => {
                const formData = await event.request.formData();
                const file = formData.get('file');
                if (file) {
                    console.log('File received:', file);
                    return new Response('File received successfully', {
                        status: 200,
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                    });
                } else {
                    return new Response('No file received', {
                        status: 400,
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                    });
                }
            })()
        );
    }
});
