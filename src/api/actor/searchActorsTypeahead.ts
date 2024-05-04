import type { Actor } from '../../types'

const searchActorsTypeahead = async (
	query: string,
	limit: number = 10
): Promise<{
	actors: Actor[]
	cursor?: string
}> => {
	if (query) {
		const response = await fetch(
			`https://api.bsky.app/xrpc/app.bsky.actor.searchActorsTypeahead?q=${query}&limit=${limit}`
		)

		return await response.json()
	}
	return {
		actors: []
	}
}

export default searchActorsTypeahead
