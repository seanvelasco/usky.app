import { For } from 'solid-js'
import { cache, createAsync, RouteSectionProps } from '@solidjs/router'
// import { Meta, Title } from '@solidjs/meta'
import getFeed from '../api/feed/getFeed'
import FeedPost from '../components/Post'
import Spinner from '../components/Spinner'

export const getDiscoveryFeed = cache(
	async (feed: string) => await getFeed(feed),
	'home'
)

const Discover = (props: RouteSectionProps) => {
	const feeds: Record<string, string> = {
		'/': 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot',
		'/hot': 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/hot-classic'
	}

	const feed = createAsync(() =>
		getDiscoveryFeed(feeds[props.location.pathname])
	)
	// const title = 'Bluesky (usky.app)'
	// const description =
	// 	"Minimalist web client for the decentralized social network Bluesky - see what's happening, discover new things, and look up people you know."

	return (
		<>
			{/*<Title>{title}</Title>*/}
			{/*<Meta name='description' content={description} />*/}
			{/*<Meta property='og:title' content={title} />*/}
			{/*<Meta property='og:description' content={description} />*/}
			{/*<Meta name='twitter:title' content={title} />*/}
			{/*<Meta name='twitter:description' content={description} />*/}
			{/*is For.fallback the same as wrapping For in Suspense? */}
			<For each={feed()?.feed} fallback={<Spinner />}>
				{(post) => <FeedPost {...post} />}
			</For>
		</>
	)
}

export default Discover
