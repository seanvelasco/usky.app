export const getPopularTags = async (
	limit = 25
): Promise<
	{
		hashtag: string
		count: number
	}[]
> => {
	const response = await fetch(`https://trends.usky.app?limit=${limit}`)
	return await response.json()
}

export default getPopularTags
