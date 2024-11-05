import { query } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Actor } from '../../types'

export const getFollowers = query(
	async (
		actor: string
	): Promise<{
		followers: Omit<Actor, 'viewer'>[]
		subject: Omit<Actor, 'viewer'>
		cursor?: string
	}> => {
		const response = await fetch(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.graph.getFollowers?actor=${actor}`
		)

		return await response.json()
	},
	'profile_followers'
)

export default getFollowers
