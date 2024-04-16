const listRecords = async (
	repo: string,
	collection: string,
	limit = 100,
	timeout = 20000
) => {
	const controller = new AbortController()

	const abortTimeout = setTimeout(() => {
		controller.abort()
	}, timeout)

	try {
		const response = await fetch(
			`https://bsky.social/xrpc/com.atproto.repo.listRecords?repo=${repo}&collection=${collection}&limit=${limit}`,
			{
				signal: controller.signal
			}
		)

		if (response.status !== 200) {
			return
		}

		const body = await response.json()

		return body
	} catch (error) {
		console.error(
			`Cancelled getRecord(${repo}, ${collection}, ${limit})`,
			error
		)
	} finally {
		clearTimeout(abortTimeout)
	}
}

export { listRecords }

export default listRecords
