import type { Profile } from '../../types'
import { PUBLIC_API_BASE_URL } from '../../constants'

const getSuggestions = async () // actor?: string,
// accessJwt?: string
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

	if (response.ok) {
		return await response.json()
	}
}

export { getSuggestions }

export default getSuggestions
