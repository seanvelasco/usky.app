const getPosts = async (uris: string[], timeout = 20000) => {
	const controller = new AbortController()

	const abortTimeout = setTimeout(() => {
		controller.abort()
	}, timeout)

	try {
		uris.length = 25

		const response = await fetch(
			`https://api.bsky.app/xrpc/app.bsky.feed.getPosts?uris=${uris.join(
				'&uris='
			)}`,
			{
				signal: controller.signal
			}
		)

		if (response.status !== 200) {
			return
		}

		const body = await response.json()

		return body
	} catch (error) {
		console.error(`Cancelled getPosts()`, error)
	} finally {
		clearTimeout(abortTimeout)
	}
}

export { getPosts }

export default getPosts
