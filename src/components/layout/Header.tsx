import { Show, Switch, Match, Suspense, JSXElement } from 'solid-js'
import {
	A,
	useNavigate,
	useLocation,
	useParams,
	createAsync,
	useMatch
} from '@solidjs/router'
import Search from '../Search'
import { getProfileData } from '../../routes/profile/[profile]'
import { getPostData } from '../../routes/profile/[profile]/post/[post]'
import { feedGeneratorData } from '../../routes/profile/[profile]/feed/[feed]'
import { getListData } from '../../routes/profile/[profile]/lists/[list]'
import { ChevronLeft } from '../../assets/ChevronLeft'
import EllipsisIcon from '../../assets/EllipsisIcon'
import { isOwnProfile } from '../../utils'
import styles from './Header.module.css'
import Dropdown from '../Dropdown'
import { setSession } from '../../storage/session'
import { action, useAction, redirect } from '@solidjs/router'

const logout = action(async () => {
	console.log('attempting to logout')
	setSession({})
	throw redirect('/')
})

export const ProfilePageHeader = () => {
	const params = useParams()
	const profile = createAsync(() => getProfileData(params.profile))
	const signoff = useAction(logout)
	return (
		<Show when={profile()}>
			{(profile) => (
				<div class={styles.profile}>
					<p>{profile().displayName ?? profile().handle}</p>
					<Show when={isOwnProfile(profile())}>
						<Dropdown.Container>
							<Dropdown.Trigger>
								<button class={styles.button}>
									<EllipsisIcon />
								</button>
							</Dropdown.Trigger>
							<Dropdown.Content>
								{/* <Dropdown.Item>Settings</Dropdown.Item> */}
								<Dropdown.Item>
									<button onclick={signoff}>Logout</button>
								</Dropdown.Item>
							</Dropdown.Content>
						</Dropdown.Container>
					</Show>
				</div>
			)}
		</Show>
	)
}

export const PostPageHeader = () => {
	const params = useParams()
	const post = createAsync(() =>
		getPostData({ profile: params.profile, post: params.post })
	)
	const profile = () => post()?.post?.thread.post.author
	return (
		<Suspense>
			<p>
				Post by{' '}
				<A href={`/profile/${profile()?.handle}`}>
					{profile()?.displayName ?? profile()?.handle}
				</A>
			</p>
		</Suspense>
	)
}

export const TimelineHeader = () => (
	<div class={styles.timeline}>
		<A activeClass='highlight' end href='/'>
			Discover
		</A>
		<A activeClass='highlight' end href='/hot'>
			What's Hot
		</A>
		<A activeClass='highlight' end href='/live'>
			Live
		</A>
	</div>
)

const FeedHeader = () => {
	const params = useParams()
	const feedGenerator = createAsync(() =>
		feedGeneratorData({ profile: params.profile, feed: params.feed })
	)
	return (
		<Suspense>
			<p>
				{feedGenerator()?.view.displayName}{' '}
				<span>
					feed by{' '}
					<A
						href={`/profile/${
							feedGenerator()?.view?.creator?.handle
						}`}
					>
						{feedGenerator()?.view?.creator?.displayName}
					</A>
				</span>
			</p>
		</Suspense>
	)
}

const ListHeader = () => {
	const params = useParams()
	const list = createAsync(() =>
		getListData({ profile: params.profile, list: params.list })
	)
	return (
		<Suspense>
			<p>
				{list()?.list.name}{' '}
				<span>
					list by{' '}
					<A href={`/profile/${list()?.list.creator.handle}`}>
						{list()?.list.creator?.displayName ??
							list()?.list.creator.handle}
					</A>
				</span>
			</p>
		</Suspense>
	)
}

const GenericHeader = (props: { children: JSXElement }) => (
	<p>{props.children}</p>
)

const Header = () => {
	// Should Header be its own Router?
	// What's the performance implication of using multiple useMatch
	const navigate = useNavigate()
	const location = useLocation()
	const params = useParams()

	const isHome = () => ['/', '/hot', '/live'].includes(location.pathname)
	const isTrends = useMatch(() => '/trends')
	const isFeeds = useMatch(() => '/feeds')
	const isAbout = useMatch(() => '/about')
	const isSearch = () =>
		['/search', '/hashtag'].some((path) =>
			location.pathname.startsWith(path)
		)

	const back = () => navigate(-1)

	return (
		<header class={styles.header}>
			<div class={styles.inner}>
				{/* to-do: history always exists regardless of history, check other things */}
				<Show when={history && !isHome()}>
					<button class={styles.back} onClick={back}>
						<ChevronLeft />
					</button>
				</Show>
				<Switch>
					<Match when={isHome()}>
						<TimelineHeader />
					</Match>
					<Match when={isSearch()}>
						<Search />
					</Match>
					<Match when={isTrends()}>
						<GenericHeader>
							Trending in the past 2 days
						</GenericHeader>
					</Match>
					<Match when={isFeeds()}>
						<GenericHeader>Feeds</GenericHeader>
					</Match>
					<Match when={isAbout()}>
						<GenericHeader>About usky.app</GenericHeader>
					</Match>
					<Match when={params.post}>
						<PostPageHeader />
					</Match>
					<Match when={params.feed}>
						<FeedHeader />
					</Match>
					<Match when={params.list}>
						<ListHeader />
					</Match>
					<Match when={params.profile}>
						<ProfilePageHeader />
					</Match>
				</Switch>
			</div>
		</header>
	)
}

export default Header
