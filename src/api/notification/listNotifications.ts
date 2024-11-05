import { query } from '@solidjs/router'
import { SERVICE_BASE_URL } from '../../constants'
import type { Notification } from '../../types'

export const listNotifications = query(
	async (
		token: string
	): Promise<{
		notifications: Notification[]
		seenAt: string
	}> => {
		const response = await fetch(
			`${SERVICE_BASE_URL}/xrpc/app.bsky.notification.listNotifications`,
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		)

		return await response.json()
	},
	'notifications'
)

export default listNotifications
