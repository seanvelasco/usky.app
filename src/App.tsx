import { For } from 'solid-js' // , Show, Suspense, lazy

import {
	A,
	// Route,
	// Router,
	type RouteSectionProps
	// useLocation,
	// useNavigate
} from '@solidjs/router'

// import Discover, { DiscoverData } from './routes'
// import About from './routes/about'
// import Hot from './routes/hot'
// import Profile, {
// 	Posts,
// 	PostsData,
// 	ProfileData
// } from './routes/profile/[profile]'
// import Feeds, { FeedsData } from './routes/profile/[profile]/feed'
// import Feed, { FeedData } from './routes/profile/[profile]/feed/[feed]'
// import Followers, { FollowersData } from './routes/profile/[profile]/followers'
// import Following, { FollowingData } from './routes/profile/[profile]/following'
// import Likes, { LikesData } from './routes/profile/[profile]/likes'
// import Lists, { ListsData } from './routes/profile/[profile]/lists'
// import Media from './routes/profile/[profile]/media'
// import Post, { PostData } from './routes/profile/[profile]/post/[post]'
// import Replies from './routes/profile/[profile]/replies'
// import SearchPage from './routes/search'
// const Firehose = lazy(() => import('./routes/live'))

// import Search from './components/Search'
import AuthModal from './components/auth/AuthModal'
// import Sidebar from './components/layout/Sidebar'

// import { ChevronLeft } from './assets/ChevronLeft'
import { FeedsIcon } from './assets/FeedsIcon'
import { HomeIcon } from './assets/HomeIcon'
import { SearchIcon } from './assets/SearchIcon'

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

// const FeedView = () => {
// 	return (
// 		<Router>
// 			<Route path='/'>
// 				<Route
// 					path='/'
// 					component={Discover}
// 					load={DiscoverData}
// 				/>
// 				<Route path='/hot' component={Hot} load={DiscoverData} />
// 				<Route path='/live' component={Firehose} />
// 				<Route path='/search' component={SearchPage} />
// 				<Route path='/feeds' component={SearchPage} />
// 				<Route path='/about' component={About} />
// 				<Route
// 					path='/profile/:profile/post/:post'
// 					component={Post}
// 					load={PostData}
// 				/>
// 				<Route
// 					path='/profile/:profile/feed/:feed'
// 					component={Feed}
// 					load={FeedData}
// 				/>
// 				<Route
// 					path='/profile/:profile/lists/:list'
// 					component={Feed}
// 					load={FeedData}
// 				/>
// 				<Route
// 					path='/profile/:profile'
// 					component={Profile}
// 					load={ProfileData}
// 				>
// 					<Route path='/' load={PostsData}>
// 						<Route path='/' component={Posts} />
// 						<Route path='/replies' component={Replies} />
// 						<Route path='/media' component={Media} />
// 					</Route>
// 					<Route path='/likes' component={Likes} load={LikesData} />
// 					<Route path='/feed' component={Feeds} load={FeedsData} />
// 					<Route path='/lists' component={Lists} load={ListsData} />
// 					<Route
// 						path='/followers'
// 						component={Followers}
// 						load={FollowersData}
// 					/>
// 					<Route
// 						path='/following'
// 						component={Following}
// 						load={FollowingData}
// 					/>
// 				</Route>
// 			</Route>
// 		</Router>
// 	)
// }

export const FeedView = () => {}

const App = (props: RouteSectionProps) => {
	return (
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
					{/*<Header />*/}
					{/*<FeedView />*/}
					{props.children}
				</div>
			</main>
			<aside class={`${styles.sidebar} ${styles.right}`}>
				{/*<Sidebar />*/}
			</aside>
		</div>
	)
}

export default App
