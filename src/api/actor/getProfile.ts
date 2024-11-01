import { cache } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Profile } from '../../types'

const getProfile = async (actor: string): Promise<Profile> => {
	const response = await fetch(
		`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.actor.getProfile?actor=${actor}`
	)

	return await response.json()
}

export default cache(getProfile, 'profile')
