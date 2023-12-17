import { type RouteDataFuncArgs, useRouteData } from "@solidjs/router";
import { For, Suspense, createResource } from "solid-js";
import getPosts from "../../../../api/getPostsOld";
import listRecords from "../../../../api/repo/listRecords";
import Post from "../../../../components/Post";
import Spinner from "../../../../components/Spinner";
import type { FeedPost } from "../../../../types";

const getLikes = async (profile: string): Promise<{ posts: FeedPost[] }> => {
	const likes = await listRecords(profile, "app.bsky.feed.like");

	const { records } = likes; // cursor

	const likedUris = [];

	for (const like of records) {
		likedUris.push(like?.value?.subject?.uri);
	}

	return await getPosts(likedUris);
};

export const LikesData = ({ params }: RouteDataFuncArgs) => {
	const [posts] = createResource(() => params.profile, getLikes);
	return posts;
};

export const Likes = () => {
	const posts = useRouteData<typeof LikesData>();

	return (
		<Suspense fallback={<Spinner />}>
			<For each={posts()?.posts}>{(post) => <Post post={post} />}</For>
		</Suspense>
	);
};

export default Likes;
