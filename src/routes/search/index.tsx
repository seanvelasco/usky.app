import { ErrorBoundary, For } from 'solid-js'
import {
	createAsync,
	cache,
	useSearchParams,
	RouteSectionProps
} from '@solidjs/router'
import searchActors from '../../api/actor/searchActors'
import searchPosts from '../../api/feed/searchPosts'
import Entry from '../../components/Entry'
import Post from '../../components/Post'
import { Link, Meta, Title } from '@solidjs/meta'
// import styles from './styles.module.css'

export const actorSearch = cache(
	async (query: string) => await searchActors(query),
	'actors_search'
)

export const postSearch = cache(
	async (query: string) => await searchPosts({ query }),
	'posts_search'
)

const Empty = () => <></>

export const Search = () => {
	const [searchParams] = useSearchParams()
	const actors = createAsync(() => actorSearch(searchParams.q || ''))
	const posts = createAsync(() => postSearch(searchParams.q || ''))

	// const routes = [
	// 	{
	// 		title: 'Top',
	// 		href: ''
	// 	},
	// 	{
	// 		title: 'Latest',
	// 		href: 'latest'
	// 	},
	// 	{
	// 		title: 'People',
	// 		href: 'people'
	// 	},
	// 	{
	// 		title: 'Media',
	// 		href: 'media'
	// 	}
	// ]

	const title = () => `${searchParams.q ?? 'Search'} - Bluesky (usky.app)`
	const description = () =>
		searchParams.q
			? `Search results for ${searchParams.q} on Bluesky`
			: 'Search for people and posts on Bluesky'

	return (
		<>
			<ErrorBoundary fallback={<Title>{title()}</Title>}>
				<Title>{title()}</Title>
				<Meta name='description' content={description()} />
				<Meta property='og:title' content={title()} />
				<Meta property='og:description' content={description()} />
				<Meta name='twitter:title' content={title()} />
				<Meta name='twitter:description' content={description()} />
			</ErrorBoundary>
			{/*<div class={styles.nav}>*/}
			{/*	<For each={routes}>*/}
			{/*		{(route) => <A noScroll={true}*/}
			{/*		               end={true}*/}
			{/*		               activeClass='underline'*/}
			{/*		               href={route.href}>{route.title}</A>}*/}
			{/*	</For>*/}
			{/*</div>*/}
			<For each={actors()?.actors} fallback={<Empty />}>
				{(actor) => (
					<Entry
						displayName={actor?.displayName ?? actor.handle}
						handle={actor?.handle}
						description={actor?.description}
						avatar={actor.avatar ?? '/avatar.svg'}
						href={`/profile/${actor.handle}`}
					/>
				)}
			</For>
			<For each={posts()?.posts}>{(post) => <Post post={post} />}</For>
		</>
	)
}

export const HashtagPage = (props: RouteSectionProps) => {
	const posts = createAsync(() => postSearch(props.params.hashtag))
	const title = () => `#${props.params} - Bluesky (usky.app)`
	const description = () => `Posts about ${props.params} on Bluesky`
	const url = () => `https://usky.app/hashtag/${props.params}`
	return (
		<>
			<ErrorBoundary fallback={<Title>{title()}</Title>}>
				<Title>{title()}</Title>
				<Meta name='description' content={description()} />
				<Meta property='og:title' content={title()} />
				<Meta property='og:description' content={description()} />
				<Meta property='og:url' content={url()} />
				<Meta name='twitter:title' content={title()} />
				<Meta name='twitter:description' content={description()} />
				<Meta property='twitter:url' content={url()} />
				<Link rel='canonical' href={url()} />
			</ErrorBoundary>
			<For each={posts()?.posts}>{(post) => <Post post={post} />}</For>
		</>
	)
}

export default Search
