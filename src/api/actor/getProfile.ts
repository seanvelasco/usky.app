import type { Profile } from '../../types'

const getProfile = async (actor: string): Promise<Profile> => {

	const response = await fetch(
		`https://api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${actor}`,

	)


	return await response.json()
}

export { getProfile }

export default getProfile
