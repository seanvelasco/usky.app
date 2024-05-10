import { PUBLIC_API_BASE_URL } from '../../constants'
import type { FeedGenerator } from '../../types'

const getFeedGenerator = async (feed: string): Promise<FeedGenerator> => {
	const request = new Request(
		`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getFeedGenerator?feed=${feed}`
	)

	const response = await fetch(request)

	const body = await response.json()
	return body
}

export { getFeedGenerator }

export default getFeedGenerator
