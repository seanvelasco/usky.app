import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Actor, List } from '../../types'

const getList = async (
	list: string
): Promise<{
	list: List
	items: {
		subject: Omit<Actor, 'viewer'>
	}[]
	cursor?: string
}> => {
	const request = new Request(
		`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.graph.getList?list=${list}`
	)

	const response = await fetch(request)

	return await response.json()
}

export default getList
