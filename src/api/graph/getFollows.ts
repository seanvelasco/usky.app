import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Actor } from '../../types'

const getFollows = async (
	actor: string
): Promise<{
	follows: Omit<Actor, 'viewer'>[]
	subject: Omit<Actor, 'viewer'>
	cursor?: string
}> => {
	const response = await fetch(
		`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.graph.getFollows?actor=${actor}`
	)

	return await response.json()
}
export { getFollows }

export default getFollows
