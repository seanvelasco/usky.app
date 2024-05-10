import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Actor } from '../../types'

const getFollowers = async (
	actor: string
): Promise<{
	followers: Omit<Actor, 'viewer'>[]
	subject: Omit<Actor, 'viewer'>
	cursor?: string
}> => {
	const response = await fetch(
		`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.graph.getFollowers?actor=${actor}`
	)

	const body = await response.json()
	return body
}

export { getFollowers }

export default getFollowers
