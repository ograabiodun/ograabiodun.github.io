const cacheName = 'v1';
const cacheFiles = [
    '/',
    './Index.html',
    './pages/userBoard.html',
    './pages/adminBoard.html',    
    './pages/register.html',
    './app.js',
    './manifest.webmanifest',
    '/server.js',
    '/serviceWorker.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/vue@2.6.11',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css',
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js",
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js",
    "https://code.jquery.com/jquery-1.11.1.min.js",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
    
]


self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(cacheFiles);
    console.log("[ServiceWorker] Installed")

    return self.skipWaiting();

});

// self.addEventListener('activate', e => {
//     self.clients.claim();
// });
self.addEventListener('activate', function(e){
    console.log("[ServiceWorker] Activated")

    e.waitUntil(
        caches.keys().then(function(cachesNames) {
            return Promise.all(cachesNames.map(function(thisCacheName){
                if (thisCacheName !== cacheName) {
                    console.log("[ServiceWorker] Removing Cached Files from", thisCacheName);
                    return caches.delete(thisCacheName);
                }
            }))
        })
    )
});

self.addEventListener('fetch', function(e){
    e.respondWith(
        caches.match(e.request).then(cacheRes => {
            return cacheRes || fetch(e.request);
        })
    );
    console.log("[ServiceWorker] fetching...");

});

console.log('Service worker loaded...');

self.addEventListener('push', e => {
    const data = e.data.json();
    console.log('Push received...');
    self.registration.showNotification(data.title, {
        body: 'Notified by Mudi',
        icon: '/pages/icons/icon-96.png'
    });
});
