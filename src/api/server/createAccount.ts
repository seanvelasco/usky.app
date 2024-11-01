import { SERVICE_BASE_URL } from '../../constants'
import type { Session, CreateAccountProps } from '../../types'

const createAccount = async ({
	email,
	password,
	handle,
	inviteCode,
	verificationCode
}: CreateAccountProps): Promise<Session> => {
	const response = await fetch(
		`${SERVICE_BASE_URL}/xrpc/com.atproto.server.createAccount`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password,
				handle,
				inviteCode,
				verificationCode
			})
		}
	)

	return await response.json()
}

export default createAccount
