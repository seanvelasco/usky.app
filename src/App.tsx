import { createSignal, Show, For, Suspense } from "solid-js"
import {
	Outlet,
	A,
	useLocation,
	useNavigate,
	Routes,
	Route,
	useRouteData
} from "@solidjs/router"
import { HomeIcon } from "./assets/HomeIcon"
import { SearchIcon } from "./assets/SearchIcon"
import { FeedsIcon } from "./assets/FeedsIcon"
import Search from "./components/Search"
import { ChevronLeft } from "./assets/ChevronLeft"
import Sidebar from "./components/layout/Sidebar"
import Post, { PostData } from "./routes/profile/[profile]/post/[post]"
import Profile, {
	Posts,
	Replies,
	Media,
	Likes,
	Feeds,
	Lists,
	Followers,
	Following,
	ProfileData,
	PostsData,
	LikesData,
	FollowersData,
	FollowingData,
	FeedsData,
	ListsData
} from "./routes/profile/[profile]"
import Feed, { FeedData } from "./routes/profile/[profile]/feed/[feed]"
import SearchPage from "./routes/search"
import styles from "./App.module.css"
import Discover, { DiscoverData } from "./routes"
import AuthModal from "./components/auth/AuthModal"
import About from "./routes/about"

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
				<Route path="/hot" component={Discover} data={DiscoverData} />
				<Route path="/live" component={Discover} data={DiscoverData} />
				<Route path="/search" component={SearchPage} />
				<Route path="/feeds" component={SearchPage} />
				<Route path="/about" component={About} />
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
					R
				</Route>
				<Route
					path="/profile/:profile/post/:post"
					component={Post}
					data={PostData}
				></Route>
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
			</Route>
		</Routes>
	)
}

const App = () => {
	// const token = sessionStorage.getItem("token")

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
					<Heading />
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
				<Outlet />
			</div>
		</header>
	)
}

export const Heading = () => {
	return (
		<Routes>
			<Route path="/" component={Header}>
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
				<Route path="/profile/:profile/post/:post" data={ProfileData}>
					<p>Post</p>
				</Route>
			</Route>
		</Routes>
	)
}

export default App
