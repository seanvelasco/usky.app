import { For, Suspense, Show } from 'solid-js'
import { A, type RouteSectionProps } from '@solidjs/router'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import AuthModal from './components/auth/AuthModal'
import { FeedsIcon } from './assets/FeedsIcon'
import { HomeIcon } from './assets/HomeIcon'
import { SearchIcon } from './assets/SearchIcon'
import Spinner from './components/Spinner'
import styles from './App.module.css'

// this is for auth
import { session } from './storage/session'
import { cache, createAsync } from '@solidjs/router'
import { getSession } from './api/identity/getSession'
import { getProfileData } from './routes/profile/[profile]'
import Avatar from './components/Avatar'

const getBlueskySession = cache(
	async () => await getSession(session.accessJwt),
	'session'
)

const Navigation = () => {
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
			label: 'Feeds',
			href: '/feeds',
			icon: <FeedsIcon />
		}
	]

	return (
		<nav class={styles.nav}>
			<For each={links}>
				{(link) => (
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
				)}
			</For>
			<Show when={profile()}>
				<div
					class={styles.icon}
					style={{
						'border-radius': '50%'
					}}
				>
					<Avatar src={profile()?.avatar} size='1.5rem' />
				</div>
				<div class={styles.icon}>
					<AuthModal />
				</div>
			</Show>
		</nav>
	)
}

const App = (props: RouteSectionProps) => {
	const session = createAsync(() => getBlueskySession())
	return (
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
						<Suspense fallback={<Spinner />}>
							{props.children}
						</Suspense>
					</div>
				</main>
				<aside class={`${styles.sidebar} ${styles.right}`}>
					<Sidebar />
				</aside>
			</div>
		</Suspense>
	)
}

export default App
