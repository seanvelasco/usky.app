import { cache, createAsync, type RouteSectionProps } from '@solidjs/router'
import { For } from 'solid-js'
import getActorFeeds from '../../../../api/feed/getActorFeeds'
import Entry from '../../../../components/Entry'

export const getFeedsData = cache(
	async (profile: string) => await getActorFeeds(profile),
	'profile_feeds'
)

export const Feeds = (props: RouteSectionProps) => {
	const feeds = createAsync(() => getFeedsData(props.params.profile))

	return (
		<For each={feeds()?.feeds}>
			{(feed) => (
				<Entry
					type='creator'
					displayName={feed.displayName}
					description={feed.description}
					avatar={feed.avatar ?? '/feed.svg'}
					href={`/profile/${feed.creator.handle}/feed/${feed.did}`}
				/>
			)}
		</For>
	)
}

export default Feeds
