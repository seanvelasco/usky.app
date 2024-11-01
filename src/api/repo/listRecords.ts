import { SERVICE_BASE_URL } from '../../constants'

export const listRecords = async (
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
			`${SERVICE_BASE_URL}/xrpc/com.atproto.repo.listRecords?repo=${repo}&collection=${collection}&limit=${limit}`,
			{
				signal: controller.signal
			}
		)

		if (response.status !== 200) {
			return
		}

		return await response.json()
	} catch (error) {
		console.error(
			`Cancelled getRecord(${repo}, ${collection}, ${limit})`,
			error
		)
	} finally {
		clearTimeout(abortTimeout)
	}
}

export default listRecords
