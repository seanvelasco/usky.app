import { Show, Suspense } from 'solid-js'

import {
	A,
	createAsync,
	useLocation,
	useParams,
	useMatch
} from '@solidjs/router'
// import useMatches from '../../utils/useMatches'
// import getSuggestions from '../../api/actor/getSuggestions'
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
	const params = useParams()
	// this should be dynamic with :profile, wrap this with auth
	// const users = createAsync(getSuggestions)
	const feeds = createAsync(getPopularFeedGenerators)
	// const isSearch = useMatches(() => ['/search', '/hashtag'])
	const isSearch = () =>
		['/search', '/hashtag'].some((path) =>
			location.pathname.startsWith(path)
		)
	const isTrends = useMatch(() => '/trends')
	return (
		<Suspense>
			<Show when={!isSearch()}>
				<Search />
			</Show>
			<Show when={params.post}>
				<RelevantSection />
			</Show>
			<Show when={!isTrends()}>
				<TrendingSection />
			</Show>
			{/*<Show*/}
			{/*	when={*/}
			{/*		location.pathname !== '/search' &&*/}
			{/*		users()*/}
			{/*	}*/}
			{/*>*/}
			{/*	{(actors) => (*/}
			{/*		<ActorsSection title='People' actors={actors().actors} />*/}
			{/*	)}*/}
			{/*</Show>*/}
			<Show when={location.pathname !== '/feeds' && feeds()?.feeds}>
				{(feeds) => <Section title='Feeds' list={feeds()} />}
			</Show>
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
	)
}

export default Sidebar
