import type { Feed } from "./../../types";

const getPopularFeedGenerators = async (): Promise<{
	feeds: Feed[];
}> => {
	const response = await fetch(
		"https://api.bsky.app/xrpc/app.bsky.unspecced.getPopularFeedGenerators",
	);
	const body = await response.json();
	return body;
};

export { getPopularFeedGenerators };

export default getPopularFeedGenerators;
