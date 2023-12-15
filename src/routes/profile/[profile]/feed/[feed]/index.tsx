import { createResource, Suspense } from "solid-js"
import { useRouteData, type RouteDataFuncArgs } from "@solidjs/router"
import getFeedGenerator from "../../../../../api/feed/getFeedGenerator"
import styles from "./styles.module.css"
import Avatar from "../../../../../components/Avatar"

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
					size="3.5rem"
					style={{
						"border-radius": "12px"
					}}
					src={feedGenerator()?.view?.avatar ?? "/feed.svg"}
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
