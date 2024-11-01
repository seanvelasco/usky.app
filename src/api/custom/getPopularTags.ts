import { cache } from '@solidjs/router'

export const getPopularTags = cache(
	async (
		limit = 25
	): Promise<
		{
			hashtag: string
			count: number
		}[]
	> => {
		const response = await fetch(`https://trends.usky.app?limit=${limit}`)
		return await response.json()
	},
	'trends'
)

export default getPopularTags
