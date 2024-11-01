import { action } from '@solidjs/router'
import { ATPROTO_PROXY } from '../../constants'
import type { Message, Session } from '../../types'

export const sendMessage = action(
	async ({
		session,
		id,
		message
	}: {
		session: Session
		id: string
		message: string
	}): Promise<Message> => {
		const response = await fetch(
			`${session.didDoc?.service[0]?.serviceEndpoint}/xrpc/chat.bsky.convo.sendMessage`,
			{
				method: 'POST',
				headers: {
					'atproto-proxy': ATPROTO_PROXY,
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
		return await response.json()
	}
)

export default sendMessage
