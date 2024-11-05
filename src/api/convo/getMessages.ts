import { query } from '@solidjs/router'
import { ATPROTO_PROXY } from '../../constants'
import type { Message, Session } from '../../types'

export const getMessages = query(
	async ({
		session,
		id,
		limit = 60
	}: {
		session: Session
		id: string
		limit?: number
	}): Promise<{
		cursor?: string
		messages: Message[]
	}> => {
		if (!session?.accessJwt) {
			throw new Error('Not authenticated')
		}
		const response = await fetch(
			`${session.didDoc?.service[0]?.serviceEndpoint}/xrpc/chat.bsky.convo.getMessages?convoId=${id}&limit=${limit}`,
			{
				method: 'GET',
				headers: {
					'atproto-proxy': ATPROTO_PROXY,
					Authorization: `Bearer ${session.accessJwt}`
				}
			}
		)

		return await response.json()
	},
	'messages'
)

export default getMessages
