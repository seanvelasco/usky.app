import { For } from 'solid-js'
import { createAsync, cache, useSearchParams } from '@solidjs/router'
import searchActors from '../../api/actor/searchActors'
import Entry from '../../components/Entry'

const actorSearch = cache(
	async (query: string) => await searchActors(query),
	'actors_search'
)

const Empty = () => <></>

export const Search = () => {
	const [searchParams] = useSearchParams()
	const actors = createAsync(() => actorSearch(searchParams.q || ''))
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
		</>
	)
}

export default Search
