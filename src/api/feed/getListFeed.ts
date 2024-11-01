import { cache } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { FeedPost } from '../../types'

// TODO: break up getListData
export const getListFeed = cache(
	async (
		list: string
	): Promise<{
		feed: {
			post: FeedPost
		}[]
		cursor?: string
	}> => {
		const response = await fetch(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getListFeed?list=${list}`,
			{ method: 'GET' }
		)
		return await response.json()
	},
	'personal_list_feed'
)

export default getListFeed
