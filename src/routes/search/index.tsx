import { ErrorBoundary, For, Show, Suspense } from 'solid-js'
import {
	createAsync,
	cache,
	useSearchParams,
	A,
	useLocation,
	type RouteSectionProps
} from '@solidjs/router'
import { Link, Meta, Title } from '@solidjs/meta'

import searchActors from '../../api/actor/searchActors'
import searchPosts from '../../api/feed/searchPosts'
import Entry from '../../components/Entry'
import Post from '../../components/Post'
import MediaCarousel from '../../components/MediaCarousel'
import Spinner from '../../components/Spinner'
import styles from './styles.module.css'

export const actorSearch = cache(
	async (query: string, limit: number = 3) =>
		await searchActors(encodeURIComponent(query), limit),
	'actors_search'
)

export const postSearch = cache(
	async (query: string, sort: 'latest' | 'top') =>
		await searchPosts({ query, limit: 100, sort }),
	'posts_search'
)

const Empty = () => <></>

export const Media = () => {
	const [searchParams] = useSearchParams()

	const posts = createAsync(() =>
		postSearch(decodeURIComponent(searchParams.q || ''), 'top')
	)

	return (
		<Suspense fallback={<Spinner />}>
			<MediaCarousel posts={posts()?.posts} />
		</Suspense>
	)
}

// per-page suspense works
// but a parent page with props.children wrapped in suspense doesnt work

export const Top = () => {
	const [searchParams] = useSearchParams()

	const location = useLocation()

	const actors = createAsync(() =>
		actorSearch(decodeURIComponent(searchParams.q || ''))
	)
	const posts = createAsync(() =>
		postSearch(decodeURIComponent(searchParams.q || ''), 'top')
	)

	return (
		<Suspense fallback={<Spinner />}>
			<Show when={actors()?.actors.length !== 0 && actors()?.actors}>
				{(actors) => (
					<div class={styles.people}>
						<For each={actors()} fallback={<Empty />}>
							{(actor) => (
								<Entry
									displayName={
										actor?.displayName ?? actor.handle
									}
									handle={actor?.handle}
									description={actor?.description}
									avatar={actor.avatar ?? '/avatar.svg'}
									href={`/profile/${actor.handle}`}
								/>
							)}
						</For>
						<A
							class={styles.expand}
							href={`/search/people${location.search}`}
						>
							View all people
						</A>
					</div>
				)}
			</Show>

			<For each={posts()?.posts}>{(post) => <Post post={post} />}</For>
		</Suspense>
	)
}

export const Latest = () => {
	const [searchParams] = useSearchParams()

	const posts = createAsync(() =>
		postSearch(decodeURIComponent(searchParams.q || ''), 'latest')
	)

	return (
		<Suspense fallback={<Spinner />}>
			<For each={posts()?.posts}>{(post) => <Post post={post} />}</For>
		</Suspense>
	)
}

export const People = () => {
	const [searchParams] = useSearchParams()
	const actors = createAsync(() =>
		actorSearch(decodeURIComponent(searchParams.q || ''), 100)
	)
	return (
		<Suspense fallback={<Spinner />}>
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
		</Suspense>
	)
}

export const Search = (props: RouteSectionProps) => {
	const [searchParams] = useSearchParams()

	const routes = [
		{
			title: 'Top',
			href: ''
		},
		{
			title: 'Latest',
			href: 'latest'
		},
		{
			title: 'People',
			href: 'people'
		},
		{
			title: 'Media',
			href: 'media'
		}
	]

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
			<div class={styles.nav}>
				<For each={routes}>
					{(route) => (
						<A
							noScroll={true}
							end={true}
							activeClass='underline'
							href={route.href + props.location.search}
						>
							{route.title}
						</A>
					)}
				</For>
			</div>
			{props.children}
		</>
	)
}

export const HashtagPage = (props: RouteSectionProps) => {
	const posts = createAsync(() =>
		postSearch(decodeURIComponent(`#${props.params.hashtag}`), 'top')
	)
	const title = () => `#${props.params.hashtag} - Bluesky (usky.app)`
	const description = () => `Posts about #${props.params.hashtag} on Bluesky`
	const url = () => `https://usky.app/hashtag/${props.params.hashtag}`
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
			<Suspense fallback={<Spinner />}>
				<For each={posts()?.posts}>
					{(post) => <Post post={post} />}
				</For>
			</Suspense>
		</>
	)
}

export default Search
