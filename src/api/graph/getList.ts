import type { Actor, FeedGenerator } from "./../../types";

const getList = async (
	list: string,
): Promise<{
	list: FeedGenerator;
	items: {
		subject: Omit<Actor, "viewer">;
	}[];
	cursor?: string;
}> => {
	const request = new Request(
		`https://api.bsky.app/xrpc/app.bsky.graph.getList?list=${list}`,
	);

	const response = await fetch(request);

	const body = await response.json();
	return body;
};
export { getList };

export default getList;
