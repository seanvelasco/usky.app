import { ErrorBoundary, For, Suspense } from 'solid-js'
import { cache, createAsync, type RouteSectionProps } from '@solidjs/router'
import getActorFeeds from '../../../../api/feed/getActorFeeds'
import Entry from '../../../../components/Entry'
import Spinner from '../../../../components/Spinner'
import { Fallback } from '..'
import { id } from '../../../../utils'

export const getFeedsData = cache(
	async (profile: string) => await getActorFeeds(profile),
	'profile_feeds'
)

export const Feeds = (props: RouteSectionProps) => {
	const feeds = createAsync(() => getFeedsData(props.params.profile))
	return (
		<ErrorBoundary fallback={<Fallback text="Unable to display feeds" />}>
			<Suspense fallback={<Spinner/>}>
				<For each={feeds()?.feeds} fallback={<Fallback text="No feeds yet" />}>
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
	)
}

export default Feeds
