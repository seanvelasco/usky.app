import { ErrorBoundary, Show, Suspense } from 'solid-js'
import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { Title, Meta, Link } from '@solidjs/meta'
import { getPostsData, getProfileData, Fallback } from '..'
import MediaCarousel from '../../../../components/MediaCarousel'
import Spinner from '../../../../components/Spinner'

export const Media = (props: RouteSectionProps) => {
	const thread = createAsync(() => getPostsData(props.params.profile))
	const profile = createAsync(() => getProfileData(props.params.profile))
	const posts = () =>
		thread()
			?.feed.filter((thread) => !thread.reason)
			.map((thread) => thread.post)

	const title = () =>
		`Media by ${profile()?.displayName || profile()?.handle} (@${profile()?.handle}) - Bluesky (usky.app)`
	const url = () => `https://usky.app/profile/${profile()?.handle}/media`

	return (
		<ErrorBoundary fallback={<Fallback text='Unable to display media' />}>
			<ErrorBoundary fallback={<Title>{title()}</Title>}>
				<Title>{title()}</Title>
				<Meta name='og:title' content={title()} />
				<Meta property='og:url' content={url()} />
				<Meta name='twitter:title' content={title()} />
				<Meta property='twitter:url' content={url()} />
				<Link rel='canonical' href={url()} />
			</ErrorBoundary>
			<Suspense fallback={<Spinner />}>
				<Show
					when={posts()?.length}
					fallback={<Fallback text='No media yet' />}
				>
					<MediaCarousel posts={posts()} />
				</Show>
			</Suspense>
		</ErrorBoundary>
	)
}

export default Media
