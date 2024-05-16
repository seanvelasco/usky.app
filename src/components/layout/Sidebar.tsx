import { Show, SuspenseList, Suspense } from 'solid-js'

import {
	A,
	createAsync,
	useLocation,
	useParams,
	useMatch
} from '@solidjs/router'
import getSuggestions from '../../api/actor/getSuggestions'
import getPopularFeedGenerators from '../../api/unspecced/getPopularFeedGenerators'
import Search from '../Search'
import Section, { ActorsSection, TagsSection } from '../Section'
import { getPostData } from '../../routes/profile/[profile]/post/[post]'
import { getTranding } from '../../routes/trends'
import styles from './Sidebar.module.css'

const TrendingSection = () => {
	const tags = createAsync(() => getTranding())

	return <Show when={tags()}>{(tags) => <TagsSection tags={tags()} />}</Show>
}

export const PopularPeopleSection = () => {
	const people = createAsync(getSuggestions)
	return (
		<Show when={people()?.actors}>
			{(actors) => <ActorsSection title='People' actors={actors()} />}
		</Show>
	)
}

const RelevantSection = () => {
	const params = useParams()
	const post = createAsync(() =>
		getPostData({ profile: params.profile, post: params.post })
	)

	return (
		<Show when={post && post()?.actors}>
			{(actors) => (
				<ActorsSection title='Relevant people' actors={actors()} />
			)}
		</Show>
	)
}

const Sidebar = () => {
	const location = useLocation()
	const feeds = createAsync(getPopularFeedGenerators)
	const isSearch = () =>
		['/search', '/hashtag'].some((path) =>
			location.pathname.startsWith(path)
		)
	const isTrends = useMatch(() => '/trends')
	const isProfile = useMatch(() => '/profile/:profile')
	const isUnderProfile = () =>
		[
			'/following',
			'/follows',
			'/replies',
			'/media',
			'/likes',
			'/feed',
			'/lists'
		].some((path) => location.pathname.endsWith(path))
	const isPost = useMatch(() => '/profile/:profile/post/:post')
	const isFeedsPage = useMatch(() => '/feeds')
	return (
		<SuspenseList revealOrder='forwards' tail='hidden'>
			<Suspense>
				<Show when={!isSearch()}>
					<Search />
				</Show>
			</Suspense>
			<Suspense>
				<Show when={isProfile() || isUnderProfile()}>
					<PopularPeopleSection />
				</Show>
			</Suspense>
			<Suspense>
				<Show when={isPost()}>
					<RelevantSection />
				</Show>
			</Suspense>
			<Suspense>
				<Show when={!isTrends()}>
					<TrendingSection />
				</Show>
			</Suspense>
			<Suspense>
				<Show when={!isSearch() && !isProfile() && !isPost()}>
					<PopularPeopleSection />
				</Show>
			</Suspense>
			<Suspense>
				<Show when={!isFeedsPage() && feeds()?.feeds}>
					{(feeds) => <Section title='Feeds' list={feeds()} />}
				</Show>
			</Suspense>
			<Suspense>
				<footer class={styles.footer}>
					<A href='/about'>About</A>
					<A
						target='_blank'
						href='https://github.com/seanvelasco/usky.app'
					>
						Source
					</A>
				</footer>
			</Suspense>
		</SuspenseList>
	)
}

export default Sidebar
