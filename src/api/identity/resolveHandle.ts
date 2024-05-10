import { PUBLIC_API_BASE_URL } from '../../constants'

const resolveHandle = async (handle: string): Promise<string> => {
	const response = await fetch(
		`${PUBLIC_API_BASE_URL}/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`
	)

	const body = await response.json()

	return body.did
}

export { resolveHandle }

export default resolveHandle
