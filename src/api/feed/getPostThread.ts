import { PUBLIC_API_BASE_URL } from '../../constants'
import type { ThreadPost } from '../../types'

const getPostThread = async (
	uri: string
): Promise<{
	thread: ThreadPost
}> => {
	const response = await fetch(
		`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getPostThread?uri=${uri}`
	)
	const body = await response.json()
	return body
}

export { getPostThread }

export default getPostThread
