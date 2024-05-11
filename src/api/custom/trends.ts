export const getPopularTags = async (limit = 25): Promise<{
    hashtag: string
    count: number
}[]> => {
    const response = await fetch(
        `https://usky.deno.dev?limit=${limit}`
    )
    return await response.json()
}


export default getPopularTags