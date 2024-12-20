import { query } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { FeedPost } from '../../types'

export const getFeed = query(
	async ({
		feed,
		limit = 20,
		cursor,
		token
	}: {
		feed: string
		limit?: number
		cursor?: string
		token?: string
	}): Promise<{
		feed: {
			post: FeedPost
		}[]
		cursor?: string
	}> => {
		const params = new URLSearchParams({
			feed,
			limit: limit.toString()
		})
		const headers = new Headers()
		if (cursor) params.set('cursor', cursor)
		if (token) {
			headers.append('Authorization', `Bearer ${token}`)
		}
		const response = await fetch(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getFeed?${params.toString()}`,
			{
				headers
			}
		)

		return await response.json()
	},
	'feed'
)

export default getFeed
