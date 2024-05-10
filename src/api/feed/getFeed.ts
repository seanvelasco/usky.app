import { PUBLIC_API_BASE_URL } from '../../constants'
import type { FeedPost } from '../../types'

const getFeed = async (
	feed: string
	// accessJwt: string
): Promise<{
	feed: {
		post: FeedPost
	}[]
	cursor?: string
}> => {
	const request = new Request(
		`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getFeed?feed=${feed}`,
		{
			method: 'GET'
			// headers: {
			// 	Authorization: 'Bearer ' + accessJwt
			// }
		}
	)

	const response = await fetch(request)
	const body = await response.json()
	return body
}

export { getFeed }

export default getFeed
