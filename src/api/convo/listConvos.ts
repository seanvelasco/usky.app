import { cache } from '@solidjs/router'
import { useSession } from '../../states/session'
import { ATPROTO_PROXY } from '../../constants'
import type { Convo } from '../../types'

export const listConvos = cache(
	async (): Promise<{
		cursor?: string
		convos: Convo[]
	}> => {
		const session = useSession()
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
