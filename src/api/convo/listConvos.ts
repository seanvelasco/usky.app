import type { Convo } from '../../types'
import { useSession } from '../../states/session'

interface ListConvosResponse {
	cursor?: string
	convos: Convo[]
}

const listConvos = async (): Promise<ListConvosResponse | undefined> => {
	const session = useSession()
	const response = await fetch(
		`${session.pds}/xrpc/chat.bsky.convo.listConvos`,
		{
			method: 'GET',
			headers: {
				"atproto-proxy": "did:web:api.bsky.chat#bsky_chat",
				Authorization: `Bearer ${session.accessJwt}`
			}
		}
	)

	if (!response.ok) return

	return await response.json()
}

export default listConvos
