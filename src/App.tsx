import { For, Suspense } from 'solid-js'
import { A, type RouteSectionProps } from '@solidjs/router'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import AuthModal from './components/auth/AuthModal'
import { FeedsIcon } from './assets/FeedsIcon'
import { HomeIcon } from './assets/HomeIcon'
import { SearchIcon } from './assets/SearchIcon'
import Spinner from './components/Spinner'
import styles from './App.module.css'

const Navigation = () => {
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
					<div>
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
			{/* <div
				style={{
					"border-radius": "50%"
				}}
			>
				<Avatar size="1.5rem" />
			</div> */}
			<div>
				<AuthModal />
			</div>
		</nav>
	)
}

const App = (props: RouteSectionProps) => {
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
