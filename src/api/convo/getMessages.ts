import type { Message } from '../../types'
import { useSession } from '../../states/session'

interface GetMessagesResponse {
	cursor?: string
	messages: Message[]
}

const getMessages = async ({
	id,
	limit
}: {
	id: string
	limit?: number
}): Promise<GetMessagesResponse> => {
	const session = useSession()
	const response = await fetch(
		`${session.didDoc?.service[0]?.serviceEndpoint}/xrpc/chat.bsky.convo.getMessages?convoId=${id}&limit=${limit || 60}`,
		{
			method: 'GET',
			headers: {
				'atproto-proxy': 'did:web:api.bsky.chat#bsky_chat',
				Authorization: `Bearer ${session.accessJwt}`
			}
		}
	)

	return await response.json()
}

export default getMessages
