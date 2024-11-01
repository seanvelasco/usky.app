import { cache } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { FeedPost } from '../../types'

export const getFeed = cache(
	async (
		feed: string
		// accessJwt: string
	): Promise<{
		feed: {
			post: FeedPost
		}[]
		cursor?: string
	}> => {
		const response = await fetch(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getFeed?feed=${feed}`,
			{
				method: 'GET'
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
