import { For, Suspense, Show, ErrorBoundary } from 'solid-js'
import { A, type RouteSectionProps } from '@solidjs/router'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
// import AuthModal from './components/auth/AuthModal'
import { FeedsIcon } from './assets/FeedsIcon'
import { HomeIcon } from './assets/HomeIcon'
import { SearchIcon } from './assets/SearchIcon'
import { BellIcon } from './assets/BellIcon'
import { BubbleIcon } from './assets/BubbleIcon'
import { ListIcon } from './assets/ListIcon'
import Spinner from './components/Spinner'
import styles from './App.module.css'

// this is for auth
import { createAsync } from '@solidjs/router'
import { getProfileData } from './routes/profile/[profile]'
import Avatar from './components/Avatar'
import { SessionProvider, useSession } from './states/session'

import MobileNav from './components/layout/MobileNav'

const Navigation = () => {
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
			label: 'Notifications',
			href: '/notifications',
			icon: <BellIcon />,
			authenticated: true
		},
		{
			label: 'Chat',
			href: '/chat',
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
			<ErrorBoundary fallback={<></>}>
				<Show when={profile()}>
					{(profile) => (
						<div class={styles.icon}>
							<A href={`/profile/${profile().handle}`}>
								<Avatar src={profile().avatar} size='1.5rem' />
							</A>
						</div>
					)}
				</Show>
			</ErrorBoundary>
			{/* <AuthModal /> */}
		</nav>
	)
}

const App = (props: RouteSectionProps) => {
	return (
		<Suspense fallback={<Spinner />}>
			<SessionProvider>
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
							<ErrorBoundary fallback={<p>An error occurred</p>}>
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
			</SessionProvider>
		</Suspense>
	)
}

export default App
