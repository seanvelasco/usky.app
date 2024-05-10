import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Feed } from '../../types'

const getPopularFeedGenerators = async (): Promise<{
	feeds: Feed[]
}> => {
	const response = await fetch(
		`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.unspecced.getPopularFeedGenerators`
	)
	const body = await response.json()
	return body
}

export { getPopularFeedGenerators }

export default getPopularFeedGenerators
