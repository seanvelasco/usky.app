import type { FeedGenerator } from './../../types'

const getFeedGenerator = async (feed: string): Promise<FeedGenerator> => {
	const request = new Request(
		`https://api.bsky.app/xrpc/app.bsky.feed.getFeedGenerator?feed=${feed}`
	)

	const response = await fetch(request)

	const body = await response.json()
	return body
}

export { getFeedGenerator }

export default getFeedGenerator
