import { ErrorBoundary, For, Suspense } from 'solid-js'
import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { Title, Meta, Link } from '@solidjs/meta'
import Post from '../../../../components/Post'
import { Fallback } from '..'
import Spinner from '../../../../components/Spinner'
import getAuthorFeed from '../../../../api/feed/getAuthorFeed.ts'
import getProfile from '../../../../api/actor/getProfile.ts'

export const Replies = (props: RouteSectionProps) => {
	const posts = createAsync(() => getAuthorFeed(props.params.profile))
	const profile = createAsync(() => getProfile(props.params.profile))

	const title = () =>
		`Posts with replies by ${profile()?.displayName || profile()?.handle} (@${profile()?.handle}) - Bluesky (usky.app)`
	const url = () => `https://usky.app/profile/${profile()?.handle}/replies`

	return (
		<ErrorBoundary fallback={<Fallback text='Unable to display replies' />}>
			<Title>{title()}</Title>
			<Meta name='og:title' content={title()} />
			<Meta property='og:url' content={url()} />
			<Meta name='twitter:title' content={title()} />
			<Meta property='twitter:url' content={url()} />
			<Link rel='canonical' href={url()} />
			<Suspense fallback={<Spinner />}>
				<For
					each={posts()?.feed.filter(
						(post) => post?.reply && !post?.reason
					)}
					fallback={<Fallback text='No replies yet' />}
				>
					{(post) => <Post {...post} />}
				</For>
			</Suspense>
		</ErrorBoundary>
	)
}

export default Replies
