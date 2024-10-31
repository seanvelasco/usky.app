import { For, Show } from 'solid-js'
import { A, createAsync } from '@solidjs/router'
import Avatar from '../Avatar'
import { useSession } from '../../states/session'
import { getProfileData } from '../../routes/profile/[profile]'
import { HomeIcon } from '../../assets/HomeIcon'
import { SearchIcon } from '../../assets/SearchIcon'
import { BellIcon } from '../../assets/BellIcon'
import { BubbleIcon } from '../../assets/BubbleIcon'
import styles from './MobileNav.module.css'

const MobileNavigation = () => {
	// To-do: reconcile this component with main Navigation
	const session = useSession()
	const profile = createAsync(() => getProfileData(session.did))

	const links = [
		{
			label: 'Home',
			href: '/',
			icon: <HomeIcon />
		},
		{
			label: 'Search',
			href: '/search',
			icon: <SearchIcon />
		},
		{
			label: 'Chat',
			href: '/messages',
			icon: <BubbleIcon />,
			authenticated: true
		},
		{
			label: 'Notifications',
			href: '/notifications',
			icon: <BellIcon />,
			authenticated: true
		}
	]

	return (
		<nav class={styles.nav}>
			<For each={links}>
				{(link) => (
					<Show when={!link.authenticated || profile()}>
						<div class={styles.icon}>
							<A
								end
								activeClass='highlight'
								aria-label={link.label}
								href={link.href}
							>
								{link.icon}
							</A>
						</div>
					</Show>
				)}
			</For>
			<Show when={profile()}>
				{(profile) => (
					<div class={styles.icon}>
						<A href={`/profile/${profile().handle}`}>
							<Avatar src={profile().avatar} size='1.5rem' />
						</A>
					</div>
				)}
			</Show>
		</nav>
	)
}

export default MobileNavigation
