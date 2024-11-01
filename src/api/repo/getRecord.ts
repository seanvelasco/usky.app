import { SERVICE_BASE_URL } from '../../constants'

export const getRecord = async (
	repo: string,
	collection: string,
	rkey: string,
	timeout = 20000
) => {
	const controller = new AbortController()

	const abortTimeout = setTimeout(() => {
		controller.abort()
	}, timeout)

	try {
		const response = await fetch(
			`${SERVICE_BASE_URL}/xrpc/com.atproto.repo.getRecord?repo=${repo}&collection=${collection}&rkey=${rkey}`,
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
			`Cancelled getRecord(${repo}, ${collection}, ${rkey})`,
			error
		)
	} finally {
		clearTimeout(abortTimeout)
	}
}

export default getRecord
