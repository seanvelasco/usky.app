import { For, Suspense, Show, ErrorBoundary, createMemo } from 'solid-js'
import {
	A,
	useMatch,
	createAsync,
	type RouteSectionProps
} from '@solidjs/router'
import getProfile from './api/actor/getProfile'
import { SessionProvider, useSession } from './states/session'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import MobileNav from './components/layout/MobileNav'
import Spinner from './components/Spinner'
import Avatar from './components/Avatar'
import Fallback from './components/Fallback'
import { FeedsIcon } from './assets/FeedsIcon'
import { HomeIcon } from './assets/HomeIcon'
import { SearchIcon } from './assets/SearchIcon'
import { BellIcon } from './assets/BellIcon'
import { BubbleIcon } from './assets/BubbleIcon'
import { ListIcon } from './assets/ListIcon'
import styles from './App.module.css'

const Navigation = () => {
	const session = useSession()
	const profile = createAsync(() => getProfile(session.did))

	const isHome = useMatch(() => '/:home?', {
		home: ['hot', 'live']
	})
	const isSearch = useMatch(() => '/:search/:filter?/*?', {
		search: ['search', 'hashtag'],
		filter: ['latest', 'people', 'media']
	})

	const isNotifications = useMatch(() => '/notifications')

	const links = createMemo(() => [
		{
			label: 'Home',
			href: '/',
			icon: () => <HomeIcon filled={Boolean(isHome())} />
		},
		{
			label: 'Search',
			href: '/search',
			icon: () => <SearchIcon />
		},
		{
			label: 'Notifications',
			href: '/notifications',
			icon: () => <BellIcon filled={Boolean(isNotifications())} />,
			authenticated: true
		},
		{
			label: 'Chat',
			href: '/messages',
			icon: () => <BubbleIcon />,
			authenticated: true
		},
		{
			label: 'Feeds',
			href: '/feeds',
			icon: () => <FeedsIcon />
		},
		{
			label: 'Lists',
			href: '/lists',
			icon: () => <ListIcon />,
			authenticated: true
		}
	])

	const isLinkActive = (href: string) => {
		switch (href) {
			case '/':
				return isHome()
			case '/search':
				return isSearch()
			case '/notifications':
				return isNotifications()
			default:
				return false
		}
	}

	return (
		<nav class={styles.nav}>
			<For each={links()}>
				{(link) => (
					<Show when={!link.authenticated || profile()}>
						<div class={styles.icon}>
							<A
								classList={{
									highlight_alt: Boolean(
										isLinkActive(link.href)
									)
								}}
								end
								activeClass='highlight'
								aria-label={link.label}
								href={link.href}
							>
								{link.icon()}
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

const App = (props: RouteSectionProps) => (
	<>
		<SessionProvider>
			<Suspense fallback={<Spinner />}>
				<div class={styles.container}>
					<aside class={`${styles.sidebar} ${styles.left}`}>
						<Navigation />
					</aside>
					<main class={styles.main}>
						<div class={styles.timeline}>
							<Header />
							<ErrorBoundary fallback={Fallback}>
								<Suspense fallback={<Spinner />}>
									{props.children}
								</Suspense>
							</ErrorBoundary>
						</div>
						<MobileNav />
					</main>
					<aside class={`${styles.sidebar} ${styles.right}`}>
						<ErrorBoundary fallback={<p>An error occurred</p>}>
							<Sidebar />
						</ErrorBoundary>
					</aside>
				</div>
			</Suspense>
		</SessionProvider>
	</>
)

export default App
