import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Thread } from '../../types'

const getListFeed = async (
	list: string
): Promise<{ feed: Thread[]; cursor?: string }> => {
	const request = new Request(
		`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getListFeed?list=${list}`,
		{
			method: 'GET'
		}
	)

	const response = await fetch(request)

	const body = await response.json()
	return body
}
export { getListFeed }

export default getListFeed
