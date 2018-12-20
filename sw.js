console.log('Service worker: Registered');

let staticCacheName = 'rest-rev-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/restaurant.html',
        '/css/styles.css',
        '/js/main.js',
        '/js/dbhelper.js',
        '/js/restaurant_info.js',
        '/data/restaurants.json',
        '/img/1.jpg',
        '/img/2.jpg',
        '/img/3.jpg',
        '/img/4.jpg',
        '/img/5.jpg',
        '/img/6.jpg',
        '/img/7.jpg',
        '/img/8.jpg',
        '/img/9.jpg',
        '/img/10.jpg'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('rest-rev-') &&
                 cacheName != staticCacheName;
        })
        .map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true}).then(function(response) {
      if (response) {
        // console.log('Found ', event.request, ' in cache');
        return response;
      }
      else {
        // console.log('Could not find ', event.request, ' in cache, fetching...');
        return fetch(event.request)
          .then(function(response) {
            const clonedResponse = response.clone();
            caches.open(staticCacheName)
              .then(function(cache) {
                cache.put(event.request, clonedResponse);
              })
              return response;
          })
      }
    })
  );
});
