import { cache } from '@solidjs/router'
import { SERVICE_BASE_URL } from '../../constants'
import type { Profile } from '../../types'

export const getSuggestedFollowsByActor = cache(
	async (
		actor?: string,
		accessJwt?: string
	): Promise<{
		suggestions: Profile[]
	}> => {
		const response = await fetch(
			`${SERVICE_BASE_URL}/xrpc/app.bsky.graph.getSuggestedFollowsByActor?actor=${actor}`,
			{
				headers: {
					Authorization: 'Bearer ' + accessJwt
				}
			}
		)

		return await response.json()
	},
	'suggested_follows'
)

export default getSuggestedFollowsByActor
