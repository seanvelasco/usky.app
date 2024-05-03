import { createAsync, cache, RouteSectionProps } from '@solidjs/router'
import { Suspense } from 'solid-js'
import getFeedGenerator from '../../../../../api/feed/getFeedGenerator'
import Avatar from '../../../../../components/Avatar'
import styles from './styles.module.css'

export const getFeed = cache(
	async ({ profile, feed }: { profile: string; feed: string }) =>
		await getFeedGenerator(
			`at://${profile}/app.bsky.feed.generator/${feed}`
		),
	'feed'
)

const Feed = (props: RouteSectionProps) => {
	const feedGenerator = createAsync(() =>
		getFeed({ profile: props.params.profile, feed: props.params.feed })
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
		</Suspense>
	)
}

export default Feed
