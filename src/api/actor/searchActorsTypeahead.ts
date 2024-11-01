import { cache } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Actor } from '../../types'

export const searchActorsTypeahead = cache(
	async (
		query: string,
		limit: number = 10
	): Promise<{
		actors: Actor[]
		cursor?: string
	}> => {
		if (query) {
			const response = await fetch(
				`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.actor.searchActorsTypeahead?q=${query}&limit=${limit}`
			)

			return await response.json()
		}
		return {
			actors: []
		}
	},
	'typeahead_search'
)

export default searchActorsTypeahead
