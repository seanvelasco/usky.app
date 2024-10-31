import type { Convo } from '../../types'
import { useSession } from '../../states/session'

const getConvo = async ({ id }: { id: string }): Promise<Convo> => {
	const session = useSession()
	const response = await fetch(
		`${session.didDoc?.service[0]?.serviceEndpoint}/xrpc/chat.bsky.convo.getConvo?convoId=${id}`,
		{
			method: 'GET',
			headers: {
				'atproto-proxy': 'did:web:api.bsky.chat#bsky_chat',
				Authorization: `Bearer ${session.accessJwt}`
			}
		}
	)

	const { convo } = await response.json()

	return convo
}

export default getConvo
