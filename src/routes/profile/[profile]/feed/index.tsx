import { createResource, For } from "solid-js"
import { useRouteData, type RouteDataFuncArgs } from "@solidjs/router"
import Entry from "../../../../components/Entry"
import getActorFeeds from "../../../../api/feed/getActorFeeds"

export const FeedsData = ({ params }: RouteDataFuncArgs) => {
	const [posts] = createResource(() => params.profile, getActorFeeds)
	return posts
}

export const Feeds = () => {
	const feeds = useRouteData<typeof FeedsData>()

	if (feeds.error) {
		return <p>Unable to retrieve feeds</p>
	}

	return (
		<For each={feeds()?.feeds}>
			{(feed) => (
				<Entry
					type="creator"
					displayName={feed.displayName}
					description={feed.description}
					avatar={feed.avatar ?? "/feed.svg"}
					href={`/profile/${feed.creator.handle}/feed/${feed.did}`}
				/>
			)}
		</For>
	)
}

export default Feeds
