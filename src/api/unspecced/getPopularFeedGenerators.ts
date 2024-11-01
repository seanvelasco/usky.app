import { cache } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Feed } from '../../types'

export const getPopularFeedGenerators = cache(
	async (): Promise<{
		feeds: Feed[]
	}> => {
		const response = await fetch(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.unspecced.getPopularFeedGenerators`
		)
		return response.json()
	},
	'popular_feed_generators'
)

export default getPopularFeedGenerators
