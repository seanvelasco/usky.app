import { Suspense, For } from 'solid-js'
import { createAsync, cache, type RouteSectionProps } from '@solidjs/router'
import getFeedGenerator from '../../../../../api/feed/getFeedGenerator'
import Avatar from '../../../../../components/Avatar'
import { getDiscoveryFeed } from '../../../..'
import Post from '../../../../../components/Post'
import styles from './styles.module.css'

export const feedGeneratorData = cache(
	async ({ profile, feed }: { profile: string; feed: string }) =>
		await getFeedGenerator(
			`at://${profile}/app.bsky.feed.generator/${feed}`
		),
	'feed_generator'
)

export const feedsData = cache(
	async ({ profile, feed }: { profile: string; feed: string }) =>
		await getDiscoveryFeed(
			`at://${profile}/app.bsky.feed.generator/${feed}`
		),
	'profile_feed'
)

const Feed = (props: RouteSectionProps) => {
	const feedGenerator = createAsync(() =>
		feedGeneratorData({
			profile: props.params.profile,
			feed: props.params.feed
		})
	)

	const feeds = createAsync(() =>
		feedsData({ profile: props.params.profile, feed: props.params.feed })
	)

	return (
		<Suspense>
			<div class={styles.card}>
				<Avatar
					size='3.5rem'
					style={{
						'border-radius': '12px'
					}}
					src={feedGenerator()?.view?.avatar ?? '/feed.svg'}
				/>
				<div class={styles.text}>
					<h3>{feedGenerator()?.view?.displayName}</h3>
					<p>{feedGenerator()?.view?.description}</p>
					<p>{feedGenerator()?.view?.likeCount}</p>
				</div>
			</div>
			<For each={feeds()?.feed}>{(post) => <Post {...post} />}</For>
		</Suspense>
	)
}

export default Feed
