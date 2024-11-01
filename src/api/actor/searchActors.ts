import { cache } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Actor } from '../../types'

export const searchActors = cache(
	async (
		query: string,
		limit: number = 25
	): Promise<{
		actors: Actor[]
		cursor: string
	}> => {
		if (query) {
			const response = await fetch(
				`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.actor.searchActors?q=${encodeURIComponent(query)}&limit=${limit}`
			)

			return await response.json()
		}
		return {
			actors: [],
			cursor: ''
		}
	},
	'actors_search'
)

export default searchActors
