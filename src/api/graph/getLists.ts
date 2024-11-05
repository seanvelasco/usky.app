import { query } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { List } from '../../types'

export const getLists = query(
	async (
		actor: string
	): Promise<{
		lists: List[]
		cursor: string
	}> => {
		// actor should be DID not handle
		const response = await fetch(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.graph.getLists?actor=${actor}`
		)

		return await response.json()
	},
	'profile_lists'
)

export default getLists
