import { createResource, For } from "solid-js"
import { useRouteData, type RouteDataFuncArgs } from "@solidjs/router"
import getFollows from "../../../../api/graph/getFollows"
import Entry from "../../../../components/Entry"

export const FollowingData = ({ params }: RouteDataFuncArgs) => {
	const [follows] = createResource(() => params.profile, getFollows)
	return follows
}

export const Following = () => {
	const follows = useRouteData<typeof FollowingData>()

	if (follows.error) {
		return <p>Unable to retrieve following</p>
	}

	return (
		<For each={follows()?.follows}>
			{(actor) => (
				<Entry
					displayName={actor?.displayName ?? actor.handle}
					handle={actor?.handle}
					description={actor?.description}
					avatar={actor.avatar ?? "/avatar.svg"}
					href={`/profile/${actor.handle}`}
				/>
			)}
		</For>
	)
}

export default Following
