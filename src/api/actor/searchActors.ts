import type { Actor } from '../../types'

const searchActors = async (
	query: string,
	limit: number = 25
): Promise<{
	actors: Actor[]
	cursor: string
}> => {
	if (query) {
		const response = await fetch(
			`https://api.bsky.app/xrpc/app.bsky.actor.searchActors?q=${query}&limit=${limit}`
		)

		return await response.json()
	}
	return {
		actors: [],
		cursor: ''
	}
}

export default searchActors
