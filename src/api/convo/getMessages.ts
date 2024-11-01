import { cache } from '@solidjs/router'
import { useSession } from '../../states/session'
import { ATPROTO_PROXY } from '../../constants'
import type { Message } from '../../types'

export const getMessages = cache(
	async ({
		id,
		limit = 60
	}: {
		id: string
		limit?: number
	}): Promise<{
		cursor?: string
		messages: Message[]
	}> => {
		const session = useSession()
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
