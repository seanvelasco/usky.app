import { cache } from '@solidjs/router'
import { useSession } from '../../states/session'
import { ATPROTO_PROXY } from '../../constants'
import type { Convo } from '../../types'

export const getConvo = cache(
	async ({ id }: { id: string }): Promise<Convo> => {
		const session = useSession()
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
