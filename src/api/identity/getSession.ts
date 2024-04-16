const resolveHandle = async (handle: string): Promise<string> => {
	const response = await fetch(
		`https://api.bsky.app/xrpc/com.atproto.server.getSession?handle=${handle}`
	)

	const body = await response.json()

	return body
}

export { resolveHandle }

export default resolveHandle
