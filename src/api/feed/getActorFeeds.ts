import { cache } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Feed } from '../../types'

export const getActorFeeds = cache(
	async (
		actor = 'bsky.app',
		limit = 100
	): Promise<{
		feeds: Feed[]
		limit?: number
	}> => {
		const response = await fetch(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getActorFeeds?actor=${actor}&limit=${limit}
        `
		)

		return await response.json()
	},
	'profile_feeds'
)

export default getActorFeeds
