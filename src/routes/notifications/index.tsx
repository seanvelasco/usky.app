import { For, Suspense } from 'solid-js'
// import { Dynamic } from 'solid-js/web'
import { cache, createAsync } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import Entry from '../../components/Entry'
import Spinner from '../../components/Spinner'
import listNotifications from '../../api/notification/listNotifications'
import { session } from '../../storage/session'

export const getNotifications = cache(
	async (token: string) => listNotifications(token),
	'notifications'
)

// like, repost, follow, mention, reply, quote, starterpack-joined

// patterns
// X liked your post Y, X reposted your post Y, X quote posted your Y
// X followed you Y
// X mentioned you Y on Z, X replied to you Y on Z
// X joined you starter pack Y

// enum Notification {
// 	follow = ''
// }

const Notifications = () => {
	const notifications = createAsync(() => getNotifications(session.accessJwt))
	const title = 'Notifications - Bluesky (usky.app)'
	return (
		<>
			<Title>{title}</Title>
			<Suspense fallback={<Spinner />}>
				<For
					each={notifications()?.notifications}
					fallback={<p>No notifications</p>}
				>
					{(notification) => (
						<Entry
							type='creator'
							displayName={notification.author.displayName!}
							description={`${notification.reason} ${JSON.stringify(notification.record)}`}
							avatar={notification.author.avatar ?? '/avatar.svg'}
							href={`/profile/${notification.author.handle}`}
						/>
					)}
				</For>
			</Suspense>
		</>
	)
}

export default Notifications
