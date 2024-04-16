import { type RouteDataFuncArgs, useRouteData } from '@solidjs/router'
import { Suspense, createResource } from 'solid-js'
import getFeedGenerator from '../../../../../api/feed/getFeedGenerator'
import Avatar from '../../../../../components/Avatar'
import styles from './styles.module.css'

export const FeedData = ({ params }: RouteDataFuncArgs) => {
	const uri = () =>
		`at://${params.profile}/app.bsky.feed.generator/${params.feed}`

	const [feedGenerator] = createResource(() => uri(), getFeedGenerator)
	return feedGenerator
}

const Feed = () => {
	const feedGenerator = useRouteData<typeof FeedData>()

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
