import { createSignal, Show, For, Suspense, createEffect } from 'solid-js'
import {
	useSearchParams,
	cache,
	A,
	useMatch,
	action,
	redirect,
	useAction,
	useParams,
	useLocation,
	useNavigate
} from '@solidjs/router'
import searchActorsTypeahead from '../api/actor/searchActorsTypeahead'
import styles from './Search.module.css'

const typeaheadSearch = cache(
	async (query: string) => await searchActorsTypeahead(query),
	'typeahead_search'
)

const goToSearch = action(async (query: string) => {
	throw redirect(`/search?q=${encodeURIComponent(query)}`)
})

export const Search = () => {
	const [results, setSearchResults] =
		createSignal<Awaited<ReturnType<typeof searchActorsTypeahead>>>()
	const navigate = useNavigate()
	const location = useLocation()
	const isSearchOrHashtagPage = () =>
		['/search', '/hashtag'].some((path) =>
			location.pathname.startsWith(path)
		)
	const isSearchPage = useMatch(() => '/search')
	const isHashtagPage = useMatch(() => '/hashtag/:hashtag')
	const params = useParams()
	const [searchParams, setSearchParams] = useSearchParams()
	const [query, setQuery] = createSignal('')

	createEffect(() => {
		if (searchParams.q) setQuery(searchParams.q)
		if (params.hashtag) setQuery(`#${params.hashtag}`)
	})

	const onSearch = async (event: Event) => {
		const { value } = event.target as HTMLInputElement

		if (isHashtagPage()) {
			await navigate('/search')
		}

		if (isSearchOrHashtagPage()) {
			setSearchParams({ q: value.trim() })
		} else {
			setQuery(decodeURIComponent(value.trim()))
			setSearchResults(await typeaheadSearch(encodeURIComponent(query())))
		}
	}

	const search = useAction(goToSearch)

	const onSubmit = async (event: Event) => {
		event.preventDefault()
		if (isSearchOrHashtagPage()) return
		await search(query())
	}

	return (
		<>
			<form
				style={{
					display: 'contents'
				}}
				onSubmit={onSubmit}
			>
				<input
					value={query()}
					autofocus={Boolean(isSearchPage())}
					onInput={onSearch}
					class={styles.search}
					type='search'
					placeholder='Search'
				/>
			</form>
			<Show when={query() && !isSearchOrHashtagPage()}>
				<A href={`/search?q=${encodeURIComponent(query())}`}>
					Search for "{query()}"
				</A>
				<Suspense>
					<For each={results()?.actors}>
						{(actors) => <p>{actors.did}</p>}
					</For>
				</Suspense>
			</Show>
		</>
	)
}

export default Search
