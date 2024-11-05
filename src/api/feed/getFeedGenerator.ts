import { query } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { FeedGenerator } from '../../types'

export const getFeedGenerator = query(
	async ({
		profile,
		feed
	}: {
		profile: string
		feed: string
	}): Promise<FeedGenerator> => {
		const feedUrl = `at://${profile}/app.bsky.feed.generator/${feed}`
		const request = new Request(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getFeedGenerator?feed=${feedUrl}`
		)

		const response = await fetch(request)

		return await response.json()
	},
	'feed_generator'
)

export default getFeedGenerator
