import { createSignal, Show, For, Suspense } from 'solid-js'
import {
	createAsync,
	useLocation,
	useSearchParams,
	cache,
	A,
	useMatch
} from '@solidjs/router'
import searchActorsTypeahead from '../api/actor/searchActorsTypeahead'
import styles from './Search.module.css'

const typeaheadSearch = cache(
	async (query: string) => await searchActorsTypeahead(query),
	'typeahead_search'
)

export const Search = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [query, setQuery] = createSignal(searchParams.q || '')
	const typeaheadResults = createAsync(() => typeaheadSearch(query()))
	const location = useLocation()
	const isSearchPage = useMatch(() => '/search')

	const onSearch = (event: Event) => {
		const { value } = event.target as HTMLInputElement
		setQuery(value)
		if (location.pathname === '/search') {
			setSearchParams({ q: value })
		}
	}

	return (
		<>
			<input
				autofocus={Boolean(isSearchPage())}
				onInput={onSearch}
				class={styles.search}
				type='search'
				placeholder='Search'
			/>
			<Show when={query()}>
				<A href={`/search?q=${query()}`}>Search for "{query()}"</A>
				<Suspense>
					<For each={typeaheadResults()?.actors}>
						{(actors) => <p>{actors.did}</p>}
					</For>
				</Suspense>
			</Show>
		</>
	)
}

export default Search
