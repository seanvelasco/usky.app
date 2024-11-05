import { query } from '@solidjs/router'
import { SERVICE_BASE_URL } from '../../constants'
import type { Session } from '../../types'

export const refreshSession = query(
	async (refreshJwt: string): Promise<Session> => {
		const response = await fetch(
			`${SERVICE_BASE_URL}/xrpc/com.atproto.server.refreshSession`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${refreshJwt}`
				}
			}
		)

		return await response.json()
	},
	'refresh_session'
)

export default refreshSession
