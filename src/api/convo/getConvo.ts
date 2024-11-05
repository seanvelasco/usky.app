import { query } from '@solidjs/router'
import { ATPROTO_PROXY } from '../../constants'
import type { Convo, Session } from '../../types'

export const getConvo = query(
	async ({
		session,
		id
	}: {
		session: Session
		id: string
	}): Promise<Convo> => {
		if (!session.accessJwt) {
			throw new Error('Not authenticated')
		}
		const response = await fetch(
			`${session.didDoc?.service[0]?.serviceEndpoint}/xrpc/chat.bsky.convo.getConvo?convoId=${id}`,
			{
				method: 'GET',
				headers: {
					'atproto-proxy': ATPROTO_PROXY,
					Authorization: `Bearer ${session.accessJwt}`
				}
			}
		)

		const body = await response.json()

		return body.convo
	},
	'convo'
)

export default getConvo
