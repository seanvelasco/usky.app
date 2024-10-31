import type { Message, Session } from '../../types'

const sendMessage = async ({
	session,
	id,
	message
}: {
	session: Session
	id: string
	message: string
}): Promise<Message | undefined> => {
	try {
		const response = await fetch(
			`${session.didDoc?.service[0]?.serviceEndpoint}/xrpc/chat.bsky.convo.sendMessage`,
			{
				method: 'POST',
				headers: {
					'atproto-proxy': 'did:web:api.bsky.chat#bsky_chat',
					Authorization: `Bearer ${session.accessJwt}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					convoId: id,
					message: {
						text: message
					}
				})
			}
		)

		if (!response.ok) return

		return await response.json()
	} catch (e) {
		console.log('ASD', e)
	}
}

export default sendMessage
