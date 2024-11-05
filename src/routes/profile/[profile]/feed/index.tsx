import { ErrorBoundary, For, Suspense } from 'solid-js'
import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { Link, Meta, Title } from '@solidjs/meta'
import getActorFeeds from '../../../../api/feed/getActorFeeds'
import Entry from '../../../../components/Entry'
import Spinner from '../../../../components/Spinner'
import Fallback from '../../../../components/ListFallback'
import getProfile from '../../../../api/actor/getProfile'
import { id } from '../../../../utils'

export const Feeds = (props: RouteSectionProps) => {
	const feeds = createAsync(() => getActorFeeds(props.params.profile))
	const profile = createAsync(() => getProfile(props.params.profile))

	const title = () =>
		`Feeds by ${profile()?.displayName || profile()?.handle} (@${profile()?.handle}) - Bluesky (usky.app)`
	const url = () => `https://usky.app/profile/${profile()?.handle}/feed`

	return (
		<>
			<Title>{title()}</Title>
			<Meta name='og:title' content={title()} />
			<Meta property='og:url' content={url()} />
			<Meta name='twitter:title' content={title()} />
			<Meta property='twitter:url' content={url()} />
			<Link rel='canonical' href={url()} />
			<ErrorBoundary
				fallback={<Fallback text='Unable to display feeds' />}
			>
				<Suspense fallback={<Spinner />}>
					<For
						each={feeds()?.feeds}
						fallback={<Fallback text='No feeds yet' />}
					>
						{(feed) => (
							<Entry
								type='creator'
								displayName={feed.displayName}
								description={feed.description}
								avatar={feed.avatar ?? '/feed.svg'}
								// feeds doesnt resolve based on handles yet
								// todo: make handle resolution work in app, but redirect to did
								href={`/profile/${feed.creator.did}/feed/${id(feed.uri)}`}
							/>
						)}
					</For>
				</Suspense>
			</ErrorBoundary>
		</>
	)
}

export default Feeds
