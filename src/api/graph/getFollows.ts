import type { Actor } from './../../types'

const getFollows = async (
	actor: string
): Promise<{
	follows: Omit<Actor, 'viewer'>[]
	subject: Omit<Actor, 'viewer'>
	cursor?: string
}> => {
	const response = await fetch(`https://api.bsky.app/xrpc/app.bsky.graph.getFollows?actor=${actor}`)

	return await response.json()
}
export { getFollows }

export default getFollows
