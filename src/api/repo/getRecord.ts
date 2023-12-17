const getRecord = async (
	repo: string,
	collection: string,
	rkey: string,
	timeout = 20000,
) => {
	const controller = new AbortController();

	const abortTimeout = setTimeout(() => {
		controller.abort();
	}, timeout);

	try {
		const response = await fetch(
			`https://bsky.social/xrpc/com.atproto.repo.getRecord?repo=${repo}&collection=${collection}&rkey=${rkey}`,
			{
				signal: controller.signal,
			},
		);

		if (response.status !== 200) {
			return;
		}

		const body = await response.json();

		return body;
	} catch (error) {
		console.error(
			`Cancelled getRecord(${repo}, ${collection}, ${rkey})`,
			error,
		);
	} finally {
		clearTimeout(abortTimeout);
	}
};

export { getRecord };

export default getRecord;
