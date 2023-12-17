import { createResource, For, Suspense } from "solid-js"
import { useRouteData, type RouteDataFuncArgs } from "@solidjs/router"
import listRecords from "../../../../api/repo/listRecords.ts"
import getPosts from "../../../../api/getPostsOld.ts"
import Post from "../../../../components/Post.tsx"
import Spinner from "../../../../components/Spinner.tsx"
import type { FeedPost } from "../../../../types"

const getLikes = async (profile: string): Promise<{ posts: FeedPost[] }> => {
	const likes = await listRecords(profile, "app.bsky.feed.like")

	const { records } = likes // cursor

	const likedUris = []

	for (const like of records) {
		likedUris.push(like?.value?.subject?.uri)
	}

	return await getPosts(likedUris)
}

export const LikesData = ({ params }: RouteDataFuncArgs) => {
	const [posts] = createResource(() => params.profile, getLikes)
	return posts
}

export const Likes = () => {
	const posts = useRouteData<typeof LikesData>()

	return (
		<Suspense fallback={<Spinner />}>
			<For each={posts()?.posts}>{(post) => <Post post={post} />}</For>
		</Suspense>
	)
}

export default Likes
