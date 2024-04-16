import {
	A,
	Route,
	Routes,
	useLocation,
	useNavigate,
	useRouteData
} from "@solidjs/router"
import { For, Show, Suspense } from "solid-js"

import Discover, { DiscoverData } from "./routes"
import About from "./routes/about"
import Hot from "./routes/hot"
import Profile, {
	Posts,
	PostsData,
	ProfileData
} from "./routes/profile/[profile]"
import Feeds, { FeedsData } from "./routes/profile/[profile]/feed"
import Feed, { FeedData } from "./routes/profile/[profile]/feed/[feed]"
import Followers, { FollowersData } from "./routes/profile/[profile]/followers"
import Following, { FollowingData } from "./routes/profile/[profile]/following"
import Likes, { LikesData } from "./routes/profile/[profile]/likes"
import Lists, { ListsData } from "./routes/profile/[profile]/lists"
import Media from "./routes/profile/[profile]/media"
import Post, { PostData } from "./routes/profile/[profile]/post/[post]"
import Replies from "./routes/profile/[profile]/replies"
import SearchPage from "./routes/search"

import Search from "./components/Search"
import AuthModal from "./components/auth/AuthModal"
import Sidebar from "./components/layout/Sidebar"

import { ChevronLeft } from "./assets/ChevronLeft"
import { FeedsIcon } from "./assets/FeedsIcon"
import { HomeIcon } from "./assets/HomeIcon"
import { SearchIcon } from "./assets/SearchIcon"

import styles from "./App.module.css"

const Navigation = () => {
	const links = [
		{
			label: "Home",
			href: "/",
			icon: <HomeIcon />
		},
		{
			label: "Search",
			href: "/search",
			icon: <SearchIcon />
		},
		{
			label: "Feeds",
			href: "/feeds",
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
							activeClass="highlight"
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

const FeedView = () => {
	return (
		<Routes>
			<Route path="/">
				<Route
					path="/"
					component={Discover}
					data={DiscoverData}
				></Route>
				<Route path="/hot" component={Hot} data={DiscoverData} />
				<Route path="/live" component={Discover} data={DiscoverData} />
				<Route path="/search" component={SearchPage} />
				<Route path="/feeds" component={SearchPage} />
				<Route path="/about" component={About} />
				<Route
					path="/profile/:profile/post/:post"
					component={Post}
					data={PostData}
				/>
				<Route
					path="/profile/:profile/feed/:feed"
					component={Feed}
					data={FeedData}
				/>
				<Route
					path="/profile/:profile/lists/:list"
					component={Feed}
					data={FeedData}
				/>
				<Route
					path="/profile/:profile"
					component={Profile}
					data={ProfileData}
				>
					<Route path="/" data={PostsData}>
						<Route path="/" component={Posts} />
						<Route path="/replies" component={Replies} />
						<Route path="/media" component={Media} />
					</Route>
					<Route path="/likes" component={Likes} data={LikesData} />
					<Route path="/feed" component={Feeds} data={FeedsData} />
					<Route path="/lists" component={Lists} data={ListsData} />
					<Route
						path="/followers"
						component={Followers}
						data={FollowersData}
					/>
					<Route
						path="/following"
						component={Following}
						data={FollowingData}
					/>
				</Route>
			</Route>
		</Routes>
	)
}

const App = () => {

	return (
		<div
			style={{
				display: "flex",
				"flex-flow": "row nowrap",
				"justify-content": "center"
			}}
		>
			<aside class={`${styles.sidebar} ${styles.left}`}>
				<Navigation />
			</aside>
			<main class={styles.main}>
				<div
					style={{
						display: "flex",
						"flex-direction": "column",
						"min-height": "100%"
					}}
				>
					<Header />
					<FeedView />
				</div>
			</main>
			<aside class={`${styles.sidebar} ${styles.right}`}>
				<Sidebar />
			</aside>
		</div>
	)
}

const ProfilePageHeader = () => {
	const profile = useRouteData<typeof ProfileData>()
	return <p>{profile()?.displayName ?? profile()?.handle} </p>
}

const TimelineHeader = () => {
	return (
		<div
			style={{
				display: "flex",
				width: "100%",
				gap: "1rem",
				"font-weight": 500,
				padding: "0 1rem"
			}}
		>
			<A
				activeClass="highlight"
				end
				style={{
					color: "var(--text-secondary)",
					flex: 1,
					"text-align": "center"
				}}
				href="/"
			>
				Discover
			</A>
			<A
				activeClass="highlight"
				end
				style={{
					color: "var(--text-secondary)",
					flex: 1,
					"text-align": "center"
				}}
				href="/hot"
			>
				What's Hot
			</A>
			<A
				activeClass="highlight"
				style={{
					color: "var(--text-secondary)",
					flex: 1,
					"text-align": "center"
				}}
				end
				href="/live"
			>
				Live
			</A>
		</div>
	)
}

const FeedHeader = () => {
	const feedGenerator = useRouteData<typeof FeedData>()
	return (
		<Suspense>
			<p>
				{feedGenerator()?.view.displayName}{" "}
				<span
					style={{
						color: "var(--text-secondary)"
					}}
				>
					by{" "}
					<a
						style={{
							color: "inherit"
						}}
						href={`/profile/${
							feedGenerator()?.view?.creator?.handle
						}`}
					>
						@{feedGenerator()?.view?.creator?.handle}
					</a>
				</span>
			</p>
		</Suspense>
	)
}

const Header = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const isHome = () => ["/", "/hot", "/live"].includes(location.pathname)

	return (
		<header
			style={{
				position: "sticky",
				top: 0,
				"background-color": "var(--background-primary)",
				"border-bottom": " 1px solid var(--border)",

				"z-index": 2,
				padding: " 0 1.5rem"
			}}
		>
			<div
				style={{
					display: "flex",
					"align-items": "center",
					height: "3.25rem",
					gap: "1rem"
				}}
			>
				<Show when={history && !isHome()}>
					<button
						style={{
							all: "unset",
							display: "flex"
						}}
						onClick={() => navigate(-1)}
					>
						<ChevronLeft />
					</button>
				</Show>
				<Routes>
					<Route
						path={["/", "hot", "/live"]}
						component={TimelineHeader}
					/>
					<Route path="/search" component={Search} />
					<Route
						path="/profile/:profile/*"
						component={ProfilePageHeader}
						data={ProfileData}
					/>
					<Route
						path="/profile/:profile/feed/:feed"
						component={FeedHeader}
						data={FeedData}
					/>
					<Route path="/profile/:profile/list/:list" />
					<Route
						path="/profile/:profile/post/:post"
						data={ProfileData}
					>
						<p>Post</p>
					</Route>
				</Routes>
			</div>
		</header>
	)
}

export default App
