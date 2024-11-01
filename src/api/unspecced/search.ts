import type { Profile } from '../../types'

interface SearchActorsBody {
	actors: Profile[]
	cursor?: string
}

export const search = async (
	query: string,
	timeout = 20000
): Promise<SearchActorsBody | undefined> => {
	const controller = new AbortController()

	const abortTimeout = setTimeout(() => {
		controller.abort()
	}, timeout)

	try {
		if (query) {
			const response = await fetch(`/api/search?q=${query}`, {
				signal: controller.signal
			})

			return await response.json()
		}
	} catch (error) {
		console.error(`Cancelled search()`, error)
	} finally {
		clearTimeout(abortTimeout)
	}
}

export default search
