import { For } from 'solid-js'
import { createAsync, cache, useSearchParams } from '@solidjs/router'
import searchActors from '../../api/actor/searchActors'
import searchPosts from '../../api/feed/searchPosts'
import Entry from '../../components/Entry'
import Post from '../../components/Post'

const actorSearch = cache(
	async (query: string) => await searchActors(query),
	'actors_search'
)

const postSearch = cache(
	async (query: string) => await searchPosts({ query }),
	'posts_search'
)

const Empty = () => <></>

export const Search = () => {
	const [searchParams] = useSearchParams()
	const actors = createAsync(() => actorSearch(searchParams.q || ''))
	const posts = createAsync(() => postSearch(searchParams.q || ''))
	return (
		<>
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

export default Search
