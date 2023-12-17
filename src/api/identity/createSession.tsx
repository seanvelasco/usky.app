const createSession = async ({
	identifier,
	password,
}: {
	identifier: string;
	password: string;
}): Promise<{
	did: string;
	handle: string;
	emailConfirmed: boolean;
	description: string;
	accessJwt: string;
	refreshJwt: string;
}> => {
	const response = await fetch(
		"https://bsky.social/xrpc/com.atproto.server.createSession",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				identifier,
				password,
			}),
		},
	);

	return await response.json();
};

export { createSession };

export default createSession;
