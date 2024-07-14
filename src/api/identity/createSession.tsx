import { SERVICE_BASE_URL } from '../../constants'
import type { Session } from '../../types'

const createSession = async ({
	identifier,
	password
}: {
	identifier: string
	password: string
}): Promise<Session | undefined> => {
	const response = await fetch(
		`${SERVICE_BASE_URL}/xrpc/com.atproto.server.createSession`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				identifier,
				password
			})
		}
	)

	return await response.json()
}

export { createSession }

export default createSession
