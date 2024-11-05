import { query } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { FeedPost } from '../../types'

type SearchActorsQuery = {
	query: string
	sort?: 'latest' | 'top'
	since?: string
	until?: string
	mentions?: string
	author?: string
	lang?: string
	domain?: string
	url?: string
	tag?: string[]
	limit?: number
	cursor?: string
}

export const searchPosts = query(
	async ({
		query,
		sort,
		since,
		until,
		mentions,
		author,
		lang,
		domain,
		url,
		tag,
		limit = 25,
		cursor
	}: SearchActorsQuery): Promise<{
		posts: FeedPost[]
		cursor: string
	}> => {
		if (query) {
			const params = JSON.parse(
				JSON.stringify({
					q: query,
					sort,
					since,
					until,
					mentions,
					author,
					lang,
					domain,
					url,
					tag: tag?.join(),
					limit: limit?.toString() ?? 25,
					cursor
				})
			)

			const searchParams = new URLSearchParams(params)

			const response = await fetch(
				`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.searchPosts?${searchParams.toString()}`
			)

			return await response.json()
		}
		return {
			posts: [],
			cursor: '' // todo
		}
	},
	'posts_search'
)

export default searchPosts
