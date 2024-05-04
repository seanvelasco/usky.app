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
		`https://api.bsky.app/xrpc/app.bsky.feed.getListFeed?list=${list}`,
		{ method: 'GET' }
	)

	const response = await fetch(request)
	return await response.json()
}

export default getListFeed
