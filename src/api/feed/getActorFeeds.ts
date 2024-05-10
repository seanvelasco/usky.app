import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Feed } from '../../types'

const getActorFeeds = async (
	actor = 'bsky.app'
): Promise<{
	feeds: Feed[]
}> => {
	const response = await fetch(
		`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getActorFeeds?actor=${actor}&limit=100
        `
	)

	const body = await response.json()

	return body
}

export { getActorFeeds }

export default getActorFeeds
