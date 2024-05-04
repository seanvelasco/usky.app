import type { List } from '../../types'

const getLists = async (
	actor: string
): Promise<{
	lists: List[]
	cursor: string
}> => {
	// actor should be DID not handle
	const response = await fetch(
		`https://api.bsky.app/xrpc/app.bsky.graph.getLists?actor=${actor}`
	)

	return await response.json()
}

export { getLists }

export default getLists
