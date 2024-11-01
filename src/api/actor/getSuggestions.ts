import { cache } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'
import type { Profile } from '../../types'

export const getSuggestions = cache(
	async () // actor?: string,
	: Promise<
		| {
				actors: Pick<
					Profile,
					| 'displayName'
					| 'handle'
					| 'avatar'
					| 'banner'
					| 'followsCount'
					| 'followersCount'
					| 'postsCount'
				>[]
				cursor: string
		  }
		| undefined
	> => {
		let request

		// if (accessJwt) {
		// 	request = new Request(
		// 		`https://bsky.social/xrpc/app.bsky.graph.getSuggestedFollowsByActor?actor=${actor}`,
		// 		{
		// 			method: 'GET',
		// 			headers: {
		// 				Authorization: 'Bearer ' + accessJwt
		// 			},
		// 		}
		// 	)
		// } else {
		request = new Request(
			`${PUBLIC_API_BASE_URL}/xrpc/app.bsky.actor.getSuggestions`,
			{
				method: 'GET'
			}
		)
		// }

		const response = await fetch(request)

		return await response.json()
	},
	'suggestions'
)

export default getSuggestions
