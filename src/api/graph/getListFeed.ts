import { query } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Thread } from '../../types'

export const getListFeed = query(
	async (list: string): Promise<{ feed: Thread[]; cursor?: string }> => {
		const response = await fetch(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getListFeed?list=${list}`
		)

		return await response.json()
	},
	'list_feed'
)

export default getListFeed
