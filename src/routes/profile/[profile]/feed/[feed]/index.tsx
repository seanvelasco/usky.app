import { For, ErrorBoundary } from 'solid-js'
import { createAsync, cache, type RouteSectionProps } from '@solidjs/router'
import getFeedGenerator from '../../../../../api/feed/getFeedGenerator'
import Avatar from '../../../../../components/Avatar'
import { getDiscoveryFeed } from '../../../..'
import Post from '../../../../../components/Post'
import styles from './styles.module.css'
import { Link, Meta, Title } from '@solidjs/meta'
import Spinner from '../../../../../components/Spinner'
import { LikesIcon } from '../../../../../assets/likes'

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

	const title = () =>
		`${feedGenerator()?.view.displayName} - Bluesky (usky.app)`
	const description = () => feedGenerator()?.view.description
	const url = () =>
		`https://usky.app/profile/${props.params.profile}/feed/${props.params.feed}`
	const avatar = () => feedGenerator()?.view?.avatar ?? '/feed.svg'

	return (
		<>
			<ErrorBoundary fallback={<Title>{title()}</Title>}>
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
			</ErrorBoundary>
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
					<div style={{
						display: 'flex',
						'flex-direction': 'row',
						gap: '0.5rem',
						color: 'var(--text-secondary)'
					}}>
						<LikesIcon />
						<p>{feedGenerator()?.view?.likeCount}</p>
					</div>
				</div>
			</div>
			<For each={feeds()?.feed} fallback={<Spinner />}>
				{(post) => <Post {...post} />}
			</For>
		</>
	)
}

export default Feed
