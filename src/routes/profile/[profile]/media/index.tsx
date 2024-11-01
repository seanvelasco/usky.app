import { ErrorBoundary, Show, Suspense } from 'solid-js'
import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { Title, Meta, Link } from '@solidjs/meta'
import { Fallback } from '..'
import MediaCarousel from '../../../../components/MediaCarousel'
import Spinner from '../../../../components/Spinner'
import getProfile from '../../../../api/actor/getProfile.ts'
import getAuthorFeed from '../../../../api/feed/getAuthorFeed.ts'

export const Media = (props: RouteSectionProps) => {
	const thread = createAsync(() => getAuthorFeed(props.params.profile))
	const profile = createAsync(() => getProfile(props.params.profile))
	const posts = () =>
		thread()
			?.feed.filter((thread) => !thread.reason)
			.map((thread) => thread.post)

	const title = () =>
		`Media by ${profile()?.displayName || profile()?.handle} (@${profile()?.handle}) - Bluesky (usky.app)`
	const url = () => `https://usky.app/profile/${profile()?.handle}/media`

	return (
		<ErrorBoundary fallback={<Fallback text='Unable to display media' />}>
			<Title>{title()}</Title>
			<Meta name='og:title' content={title()} />
			<Meta property='og:url' content={url()} />
			<Meta name='twitter:title' content={title()} />
			<Meta property='twitter:url' content={url()} />
			<Link rel='canonical' href={url()} />
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
