import { cache } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Thread } from '../../types'

export const getAuthorFeed = cache(
	async (
		actor: string,
		limit = 100
	): Promise<{
		feed: Thread[]
		cursor?: string
	}> => {
		const response = await fetch(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getAuthorFeed?actor=${actor}&limit=${limit}
	`
		)

		return await response.json()
	},
	'profile_posts'
)

export default getAuthorFeed
