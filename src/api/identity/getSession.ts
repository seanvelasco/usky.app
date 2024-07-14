import { SERVICE_BASE_URL } from '../../constants'
import type { Session } from '../../types'

const getSession = async (accessJwt: string): Promise<Session | undefined> => {
	const response = await fetch(
		`${SERVICE_BASE_URL}/xrpc/com.atproto.server.getSession`,
		{
			headers: {
				'Accept': 'application/json',
				'Authorization': `Bearer ${accessJwt}`
			}
		}

	)

	return await response.json()
}

export { getSession }

export default getSession
