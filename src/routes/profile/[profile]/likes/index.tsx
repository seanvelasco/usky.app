import { cache, createAsync, type RouteSectionProps } from '@solidjs/router'
import { ErrorBoundary, For, Suspense } from 'solid-js'
import getPosts from '../../../../api/getPostsOld'
import listRecords from '../../../../api/repo/listRecords'
import Post from '../../../../components/Post'
import Spinner from '../../../../components/Spinner'
import { Fallback } from '..'
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
		<ErrorBoundary fallback={<Fallback text="Unable to display likes" />}>
			<Suspense fallback={<Spinner />}>
				<For each={posts()?.posts} fallback={<Fallback text="No likes yet" />}>
					{(post) => <Post post={post} />}
				</For>
			</Suspense>
		</ErrorBoundary>
	)
}

export default Likes
