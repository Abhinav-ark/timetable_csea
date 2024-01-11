const cacheName = 'v1';

const cacheAssets = [
    './index.html',
    './app.js',
    './manifest.json',
    './timetable.png'
];

//Call install event
self.addEventListener('install', (e) => {
    //console.log('Service Worker: Installed');
    e.waitUntil(
      caches
        .open(cacheName)
        .then(cache => {
          console.log('Service Worker: Caching Files');
          cache.addAll(cacheAssets);
          }
        )
        .then(() => self.skipWaiting())
    );
});

//Call activate event
self.addEventListener('activate', (e) => {
    //Remove unwanted caches
    e.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if(cache !== cacheName) {
              console.log('Service Worker: Clearing Old Cache');
              return caches.delete(cache);
            }
          })
        )
      })
    );
    console.log('Service Worker: Activated');
});

// self.addEventListener("fetch", (event) => {
//   console.log("Fetching via Service worker");
//   event.respondWith(
// //       await fetch(event.request).then(res => {return res}).catch((e) => caches.match(event.request));
//          caches.match(event.request).then(res => {return res}).catch((e) => console.log(e))
//   );
// });

//Call fetch event
// self.addEventListener('fetch', (e) => {
//     //console.log('Service Worker: Fetching');
//     //e.respondWith(fetch(e.request).catch((error) => caches.match(e.request)));
//     e.respondWith(
//       (async () => {
//         try {
//           return await fetch(e.request);
//         } catch (err) {
//         // Try to get the response from a cache.
//         const cachedResponse = await caches.match(e.request);
//         // Return it if we found one.
//         if (cachedResponse) return cachedResponse;
//         // If we didn't find a match in the cache, use the network.
//         }
//       })(),
//     );
// });

// addEventListener("fetch", (event) => {
//   // Prevent the default, and handle the request ourselves.
//   event.respondWith(
//     (async () => {
//       try{
//         const res = await fetch(event.request);

//       }
//       catch(err){
//         try{
//           const cachedResponse = await caches.match(event.request.url);
//           if (cachedResponse) return cachedResponse;
//         }
//         catch(err){
//           console.log(err);
//         }
//       }
//     })(),
//   );
// });

// self.addEventListener('fetch', (e) => {
//   console.log(e.request.url);
// });