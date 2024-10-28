import { For, Suspense } from 'solid-js'
import { createAsync, cache, type RouteSectionProps } from '@solidjs/router'
import { Link, Meta, Title } from '@solidjs/meta'
import { getDiscoveryFeed } from '../../../..'
import getFeedGenerator from '../../../../../api/feed/getFeedGenerator'
import Avatar from '../../../../../components/Avatar'
import Post from '../../../../../components/Post'
import Spinner from '../../../../../components/Spinner'
import { LikesIcon } from '../../../../../assets/likes'
import styles from './styles.module.css'
import { FeedGenerator } from '../../../../../types'

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

const Fallback = (props: { feed: FeedGenerator | undefined }) => (
	<>
		<p>{props.feed?.isOnline}</p>
		<p>{props.feed?.isValid}</p>`
	</>
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

	const title = () =>
		`${feedGenerator()?.view.displayName} - Bluesky (usky.app)`
	const description = () => feedGenerator()?.view.description
	const url = () =>
		`https://usky.app/profile/${props.params.profile}/feed/${props.params.feed}`
	const avatar = () => feedGenerator()?.view?.avatar ?? '/feed.svg'

	return (
		<Suspense fallback={<Spinner />}>
			<Title>{title()}</Title>
			<Meta name='description' content={description()} />
			<Meta property='og:title' content={title()} />
			<Meta property='og:description' content={description()} />
			<Meta property='og:url' content={url()} />
			<Meta property='og:image' content={avatar()} />
			<Meta name='twitter:title' content={title()} />
			<Meta name='twitter:description' content={description()} />
			<Meta property='twitter:url' content={url()} />
			<Meta name='twitter:image' content={avatar()} />
			<Link rel='canonical' href={url()} />
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
					<div
						style={{
							display: 'flex',
							'flex-direction': 'row',
							gap: '0.5rem',
							color: 'var(--text-secondary)'
						}}
					>
						<LikesIcon />
						<p>{feedGenerator()?.view?.likeCount}</p>
					</div>
				</div>
			</div>
			<For
				each={feeds()?.feed}
				fallback={<Fallback feed={feedGenerator()} />}
			>
				{(post) => <Post {...post} />}
			</For>
		</Suspense>
	)
}

export default Feed
