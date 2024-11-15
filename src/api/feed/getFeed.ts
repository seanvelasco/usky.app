import { query } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { FeedPost } from '../../types'
export const getFeed = query(
	async (
		feed: string,
		limit: number = 20,
		cursor?: string
		// accessJwt: string
	): Promise<{
		feed: {
			post: FeedPost
		}[]
		cursor?: string
	}> => {
		const params = new URLSearchParams({
			feed,
			limit: limit.toString()
		})
		if (cursor) params.set('cursor', cursor)
		const response = await fetch(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getFeed?${params.toString()}`,
			{
				// headers: {
				// 	Authorization: 'Bearer ' + accessJwt
				// }
			}
		)

		return await response.json()
	},
	'feed'
)

export default getFeed
