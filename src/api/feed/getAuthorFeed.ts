import type { Thread } from '../../types'

const getAuthorFeed = async (
	actor: string
): Promise<
	{
		feed: Thread[]
		cursor?: string
	}
> => {
	const limit = 100
	const response = await fetch(
		`https://api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${actor}&limit=${limit}
	`
	)

	const body = await response.json()
	return body
}

export { getAuthorFeed }

export default getAuthorFeed
