import { type RouteDataFuncArgs, useRouteData } from "@solidjs/router";
import { For, createResource } from "solid-js";
import getFollowers from "../../../../api/graph/getFollowers";
import Entry from "../../../../components/Entry";

export const FollowersData = ({ params }: RouteDataFuncArgs) => {
	const [followers] = createResource(() => params.profile, getFollowers);
	return followers;
};

export const Followers = () => {
	const followers = useRouteData<typeof FollowersData>();

	if (followers.error) {
		return <p>Unable to retrieve posts</p>;
	}

	return (
		<For each={followers()?.followers}>
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
	);
};

export default Followers;
