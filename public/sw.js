self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('v1').then(function (cache) {
            return cache;
        })
    );
});

self.addEventListener('activate', function (event) {
    var cacheWhitelist = ['v1'];
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (resp) {
            return resp || fetch(event.request).then(function (response) {
                return caches.open('v1').then(function (cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            }).catch(function (err) {
                console.log("Failed to fetch, probability network")
            });
        })
    );
});

