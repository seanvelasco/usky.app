import { cache, createAsync, type RouteSectionProps } from '@solidjs/router'
import { ErrorBoundary, For, Suspense } from 'solid-js'
import getPosts from '../../../../api/getPostsOld'
import listRecords from '../../../../api/repo/listRecords'
import Post from '../../../../components/Post'
import Spinner from '../../../../components/Spinner'
import Fallback from '../../../../components/ListFallback'
import type { FeedPost } from '../../../../types'
import { Link, Meta, Title } from '@solidjs/meta'
import getProfile from '../../../../api/actor/getProfile'

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
	const profile = createAsync(() => getProfile(props.params.profile))

	const title = () =>
		`Posts liked by ${profile()?.displayName || profile()?.handle} (@${profile()?.handle}) - Bluesky (usky.app)`
	const url = () => `https://usky.app/profile/${profile()?.handle}/likes`

	return (
		<ErrorBoundary fallback={<Fallback text='Unable to display likes' />}>
			<Title>{title()}</Title>
			<Meta name='og:title' content={title()} />
			<Meta property='og:url' content={url()} />
			<Meta name='twitter:title' content={title()} />
			<Meta property='twitter:url' content={url()} />
			<Link rel='canonical' href={url()} />
			<Suspense fallback={<Spinner />}>
				<For
					each={posts()?.posts}
					fallback={<Fallback text='No likes yet' />}
				>
					{(post) => <Post post={post} />}
				</For>
			</Suspense>
		</ErrorBoundary>
	)
}

export default Likes
