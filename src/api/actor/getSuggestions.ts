import type { Profile } from '../../types'

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
		`https://api.bsky.app/xrpc/app.bsky.actor.getSuggestions`,
		{
			method: 'GET'
		}
	)
	// }

	const response = await fetch(request)

	if (response.status !== 200) {
		return
	}

	const body = await response.json()

	return body
}

export { getSuggestions }

export default getSuggestions
