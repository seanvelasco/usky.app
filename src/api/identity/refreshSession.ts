import { SERVICE_BASE_URL } from '../../constants'
import type { Session } from '../../types'

export const refreshSession = async (refreshJwt: string): Promise<Session | undefined> => {
    const response = await fetch(
        `${SERVICE_BASE_URL}/xrpc/com.atproto.server.refreshSession`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${refreshJwt}`
            },
        }
    )

    return await response.json()
}


export default refreshSession
