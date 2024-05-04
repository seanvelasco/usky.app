import type { Actor } from '../../types'

const searchActors = async (
	query: string,
	limit: number = 25
): Promise<{
	actors: Actor[]
	cursor: string
}> => {
	const response = await fetch(
		`https://api.bskyw.app/xrpc/app.bsky.actor.searchActors?q=${query}&limit=${limit}`
	)

	return await response.json()
}

export default searchActors
