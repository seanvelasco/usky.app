import { query } from '@solidjs/router'
import type { FeedPost, Session } from '../../types'
import pds from '../../utils/pds'

export const getTimeline = query(
	async ({
		limit = 20,
		cursor,
		session
	}: {
		limit?: number
		cursor?: string
		session: Session
	}): Promise<{
		feed: {
			post: FeedPost
		}[]
		cursor?: string
	}> => {
		const params = new URLSearchParams({
			limit: limit.toString()
		})
		const headers = new Headers()
		if (cursor) params.set('cursor', cursor)
		if (session.accessJwt) {
			headers.append('Authorization', `Bearer ${session.accessJwt}`)
		}
		const response = await fetch(
			`${pds(session)}/xrpc/app.bsky.feed.getTimeline?${params.toString()}`,
			{
				headers
			}
		)

		return await response.json()
	},
	'timeline'
)

export default getTimeline
