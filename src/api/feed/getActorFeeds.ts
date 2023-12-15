import type { Feed } from '../../types'

const getActorFeeds = async (
	actor: string = 'bsky.app'
): Promise<{
	feeds: Feed[]
}> => {
	const response = await fetch(
		`https://api.bsky.app/xrpc/app.bsky.feed.getActorFeeds?actor=${actor}&limit=100
        `
	)

	const body = await response.json()

	return body
}

export { getActorFeeds }

export default getActorFeeds
