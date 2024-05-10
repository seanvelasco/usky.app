import { PUBLIC_API_BASE_URL } from '../../constants'
import type { FeedPost } from '../../types'

const getListFeed = async (
	list: string
): Promise<{
	feed: {
		post: FeedPost
	}[]
	cursor?: string
}> => {
	const request = new Request(
		`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getListFeed?list=${list}`,
		{ method: 'GET' }
	)

	const response = await fetch(request)
	return await response.json()
}

export default getListFeed
