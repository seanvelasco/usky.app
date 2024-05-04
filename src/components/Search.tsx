import { createSignal, Show, For, Suspense } from 'solid-js'
import {
	createAsync,
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
	const isSearchPage = useMatch(() => '/search')

	const [_, setSearchParams] = useSearchParams()
	const [query, setQuery] = createSignal('')
	const typeaheadResults = createAsync(() => typeaheadSearch(query()))

	const onSearch = (event: Event) => {
		const { value } = event.target as HTMLInputElement
		if (isSearchPage()) {
			setSearchParams({ q: value })
		} else {
			setQuery(value)
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
			<Show when={query() && !isSearchPage()}>
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
