import { ErrorBoundary, For, Show, Suspense } from 'solid-js'
import {
	createAsync,
	cache,
	useSearchParams,
	type RouteSectionProps,
	A,
	useLocation
} from '@solidjs/router'
import searchActors from '../../api/actor/searchActors'
import searchPosts from '../../api/feed/searchPosts'
import Entry from '../../components/Entry'
import Post from '../../components/Post'
import { Link, Meta, Title } from '@solidjs/meta'
import styles from './styles.module.css'
import carouselStyles from '../../components/MediaCarousel.module.css'

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
		<Suspense>
			<div class={carouselStyles.carousel}>
				<For each={posts()?.posts}>
					{(post) => (
						<Show
							when={
								post?.embed?.$type ===
									'app.bsky.embed.images#view' &&
								post?.embed?.images
							}
						>
							{(images) => (
								<For each={images()}>
									{(image) => (
										<img
											src={image?.thumb}
											alt={image.alt}
										/>
									)}
								</For>
							)}
						</Show>
					)}
				</For>
			</div>
		</Suspense>
	)
}

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
		<Suspense>
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
		<Suspense>
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
		postSearch(`#${props.params.hashtag}`, 'top')
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
			<For each={posts()?.posts}>{(post) => <Post post={post} />}</For>
		</>
	)
}

export default Search
