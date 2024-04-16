import type { List } from './../../types'

const getLists = async (
	actor: string
): Promise<{
	lists: List[]
	cursor: string
}> => {
	const response = await fetch(
		`https://api.bsky.app/xrpc/app.bsky.graph.getLists?actor=${actor}`
	)

	const body = await response.json()

	return body
}

export { getLists }

export default getLists
