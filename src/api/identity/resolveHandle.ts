import { cache } from '@solidjs/router'
import { PUBLIC_API_BASE_URL } from '../../constants'

export const resolveHandle = cache(async (handle: string): Promise<string> => {
	const response = await fetch(
		`${PUBLIC_API_BASE_URL}/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`
	)

	const body = await response.json()

	return body.did
}, 'handle')

export default resolveHandle
