import type { Profile } from "./../../types";

interface SearchActorsBody {
	actors: Profile[];
	cursor?: string;
}

const search = async (
	query: string,
	timeout = 20000,
): Promise<SearchActorsBody | undefined> => {
	const controller = new AbortController();

	const abortTimeout = setTimeout(() => {
		controller.abort();
	}, timeout);

	try {
		if (query) {
			const response = await fetch(`/api/search?q=${query}`, {
				signal: controller.signal,
			});

			if (response.status !== 200) {
				return;
			}

			const body = await response.json();

			return body;
		}
	} catch (error) {
		console.error(`Cancelled searchActors()`, error);
	} finally {
		clearTimeout(abortTimeout);
	}
};

export { search };

export default search;
