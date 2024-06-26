import { SERVICE_BASE_URL } from '../../constants'
import type { Profile } from '../../types'

const getSuggestedFollowsByActor = async (
	actor?: string,
	accessJwt?: string
): Promise<{
	suggestions: Profile[]
}> => {
	const request = new Request(
		`${SERVICE_BASE_URL}/xrpc/app.bsky.graph.getSuggestedFollowsByActor?actor=${actor}`,
		{
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + accessJwt
			}
		}
	)

	const response = await fetch(request)

	const body = await response.json()
	return body
}

export { getSuggestedFollowsByActor }

export default getSuggestedFollowsByActor
