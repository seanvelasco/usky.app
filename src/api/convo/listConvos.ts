import { cache } from '@solidjs/router'
import { ATPROTO_PROXY } from '../../constants'
import type { Convo, Session } from '../../types'

export const listConvos = cache(
	async ({
		session
	}: {
		session: Session
	}): Promise<{
		cursor?: string
		convos: Convo[]
	}> => {
		if (!session.accessJwt) {
			throw new Error('Not authenticated')
		}

		const response = await fetch(
			`${session.didDoc?.service[0]?.serviceEndpoint}/xrpc/chat.bsky.convo.listConvos`,
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
	'convos'
)

export default listConvos
