
const CACHE_NAME = 'yadavar-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;400;700&display=swap'
];

// نصب و کش کردن فایل‌های پایه
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// پاکسازی کش‌های قدیمی
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// استراتژی Cache First برای لود سریع و آفلاین
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // اگر در کش بود برگردان، در غیر این صورت از شبکه بگیر
      return response || fetch(event.request).then((fetchResponse) => {
        // فقط درخواست‌های موفق و با پروتکل امن یا محلی را کش کن
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic' && !event.request.url.includes('esm.sh')) {
          return fetchResponse;
        }
        
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return fetchResponse;
      });
    }).catch(() => {
      // اگر کلاً اینترنت نبود و در کش هم نبود، صفحه اصلی را برگردان
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
