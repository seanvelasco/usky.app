const resolveHandle = async (handle: string): Promise<string> => {

	const response = await fetch(`https://api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`)

	const body = await response.json()

	return body.did

}

export { resolveHandle }

export default resolveHandle
