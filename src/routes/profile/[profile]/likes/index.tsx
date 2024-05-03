import { cache, createAsync, type RouteSectionProps } from '@solidjs/router'
import { For, Suspense } from 'solid-js'
import getPosts from '../../../../api/getPostsOld'
import listRecords from '../../../../api/repo/listRecords'
import Post from '../../../../components/Post'
import Spinner from '../../../../components/Spinner'
import type { FeedPost } from '../../../../types'

const getLikes = async (profile: string): Promise<{ posts: FeedPost[] }> => {
	const likes = await listRecords(profile, 'app.bsky.feed.like')

	const { records } = likes // cursor

	const likedUris = []

	for (const like of records) {
		likedUris.push(like?.value?.subject?.uri)
	}

	return await getPosts(likedUris)
}

export const getLikesData = cache(
	async (profile: string) => await getLikes(profile),
	'profile_likes'
)

export const Likes = (props: RouteSectionProps) => {
	const posts = createAsync(() => getLikesData(props.params.profile))

	return (
		<Suspense fallback={<Spinner />}>
			<For each={posts()?.posts}>{(post) => <Post post={post} />}</For>
		</Suspense>
	)
}

export default Likes
