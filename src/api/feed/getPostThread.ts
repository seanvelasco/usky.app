import { cache } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { ThreadPost } from '../../types'

export const getPostThread = cache(
	async (
		uri: string
	): Promise<{
		thread: ThreadPost
	}> => {
		const response = await fetch(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.feed.getPostThread?uri=${uri}`
		)
		return await response.json()
	},
	'post_thread'
)
export default getPostThread
