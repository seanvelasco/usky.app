import { cache } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Actor, List } from '../../types'

export const getList = cache(
	async (
		list: string
	): Promise<{
		list: List
		items: {
			subject: Omit<Actor, 'viewer'>
		}[]
		cursor?: string
	}> => {
		const response = await fetch(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.graph.getList?list=${list}`
		)

		return await response.json()
	},
	'profile_list'
)

export default getList
