self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open("your-cache-name").then((cache) => {
			return cache.addAll([
				"/",
				"/index.html",
				"/manifest.json",
				"/usky.svg"
			])
		})
	)
})

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request)
		})
	)
})
