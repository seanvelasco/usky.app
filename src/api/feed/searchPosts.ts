import type { FeedPost } from '../../types'

type SearchActorsQuery = {
	query: string
	sort?: string
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

const searchActors = async ({
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
	limit,
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
			`https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?${searchParams.toString()}`
		)

		return await response.json()
	}
	return {
		posts: [],
		cursor: ''
	}
}

export default searchActors
