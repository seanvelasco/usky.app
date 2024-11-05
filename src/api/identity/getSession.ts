import { query } from '@solidjs/router'
import { SERVICE_BASE_URL } from '../../constants'
import type { Session } from '../../types'

export const getSession = query(async (accessJwt: string): Promise<Session> => {
	const response = await fetch(
		`${SERVICE_BASE_URL}/xrpc/com.atproto.server.getSession`,
		{
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${accessJwt}`
			}
		}
	)

	return await response.json()
}, 'session')

export default getSession
