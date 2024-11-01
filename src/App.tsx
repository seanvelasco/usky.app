import { For, Suspense, Show, ErrorBoundary } from 'solid-js'
import {
	A,
	useMatch,
	createAsync,
	type RouteSectionProps
} from '@solidjs/router'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import MobileNav from './components/layout/MobileNav'
import { FeedsIcon } from './assets/FeedsIcon'
import { HomeIcon } from './assets/HomeIcon'
import { SearchIcon } from './assets/SearchIcon'
import { BellIcon } from './assets/BellIcon'
import { BubbleIcon } from './assets/BubbleIcon'
import { ListIcon } from './assets/ListIcon'
import Spinner from './components/Spinner'
import Avatar from './components/Avatar'
// import Banner from './components/Banner'
import { SessionProvider, useSession } from './states/session'
import styles from './App.module.css'
import getProfile from './api/actor/getProfile'
import Fallback from './components/Fallback'

const Navigation = () => {
	const session = useSession()

	const profile = createAsync(() => getProfile(session.did))
	const isHome = useMatch(() => '/:home?', {
		home: ['hot', 'live']
	})
	const isSearch = useMatch(() => '/search/*')
	const isNotifications = useMatch(() => '/notifications')

	const links = [
		{
			label: 'Home',
			href: '/',
			active: isHome(),
			icon: <HomeIcon filled={Boolean(isHome())} />
		},
		{
			label: 'Search',
			href: '/search',
			active: isSearch(),
			icon: <SearchIcon />
		},
		{
			label: 'Notifications',
			href: '/notifications',
			icon: <BellIcon filled={Boolean(isNotifications())} />,
			authenticated: true
		},
		{
			label: 'Chat',
			href: '/messages',
			icon: <BubbleIcon />,
			authenticated: true
		},
		{
			label: 'Feeds',
			href: '/feeds',
			icon: <FeedsIcon />
		},
		{
			label: 'Lists',
			href: '/lists',
			icon: <ListIcon />,
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
								classList={{
									highlight_alt: Boolean(link.active)
								}}
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

const App = (props: RouteSectionProps) => {
	return (
		<SessionProvider>
			<Suspense fallback={<Spinner />}>
				<div
					style={{
						display: 'flex',
						'flex-flow': 'row nowrap',
						'justify-content': 'center'
					}}
				>
					<aside class={`${styles.sidebar} ${styles.left}`}>
						<Navigation />
					</aside>
					<main class={styles.main}>
						<div
							style={{
								display: 'flex',
								'flex-direction': 'column',
								'min-height': '100%'
							}}
						>
							<Header />
							<ErrorBoundary
								fallback={(error, reset) => (
									<Fallback err={error} reset={reset} />
								)}
							>
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
					{/*<Banner />*/}
				</div>
			</Suspense>
		</SessionProvider>
	)
}

export default App
