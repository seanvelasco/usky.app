import { Meta, Title } from "@solidjs/meta";
import { useRouteData } from "@solidjs/router";
import { For, Suspense, createResource } from "solid-js";
import getFeed from "../api/feed/getFeed";
import FeedPost from "../components/Post";
import Spinner from "../components/Spinner";

export const DiscoverData = () => {
	const [feed] = createResource(
		() =>
			"at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot",
		getFeed,
	);
	return feed;
};

const Discover = () => {
	const feed = useRouteData<typeof DiscoverData>();
	const title = "Bluesky (usky.app)";
	const description =
		"Minimalist web client for the decentralized social network Bluesky - see what's happening, discover new things, and look up people you know.";

	return (
		<>
			<Title>{title}</Title>
			<Meta name="description" content={description} />
			<Meta property="og:title" content={title} />
			<Meta property="og:description" content={description} />
			<Meta name="twitter:title" content={title} />
			<Meta name="twitter:description" content={description} />

			<Suspense fallback={<Spinner />}>
				<For each={feed()?.feed}>{(post) => <FeedPost {...post} />}</For>
			</Suspense>
		</>
	);
};

export default Discover;
