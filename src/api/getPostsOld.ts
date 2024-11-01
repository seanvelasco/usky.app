import { PUBLIC_API_BASE_URL } from '../constants'

export const getPosts = async (uris: string[], timeout = 20000) => {
	const controller = new AbortController()

	const abortTimeout = setTimeout(() => {
		controller.abort()
	}, timeout)

	try {
		uris.length = 25

		const response = await fetch(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getPosts?uris=${uris.join(
				'&uris='
			)}`,
			{
				signal: controller.signal
			}
		)

		if (response.status !== 200) {
			return
		}

		return await response.json()
	} catch (error) {
		console.error(`Cancelled getPosts()`, error)
	} finally {
		clearTimeout(abortTimeout)
	}
}

export default getPosts
