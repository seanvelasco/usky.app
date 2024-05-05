import { createSignal, Show, For, Suspense } from 'solid-js'
import {
	createAsync,
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
	throw redirect(`/search?q=${query}`)
})

export const Search = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const isSearch = () =>
		['/search', '/hashtag'].some((path) =>
			location.pathname.startsWith(path)
		)
	const isSearchPage = useMatch(() => '/search')
	const isHashtagPage = useMatch(() => '/hashtag/:hashtag')
	const params = useParams()
	const [searchParams, setSearchParams] = useSearchParams()
	const [query, setQuery] = createSignal(
		searchParams.q || (isHashtagPage() ? `#${params.hashtag}` : '')
	)
	const typeaheadResults = createAsync(() => typeaheadSearch(query()))

	const onSearch = async (event: Event) => {
		const { value } = event.target as HTMLInputElement

		if (isHashtagPage()) {
			await navigate('/search')
		}

		if (isSearch()) {
			setSearchParams({ q: value.trim() })
		} else {
			setQuery(value.trim())
		}
	}

	const search = useAction(goToSearch)

	const onSubmit = async (event: Event) => {
		event.preventDefault()
		if (isSearch()) return
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
			<Show when={query() && !isSearch()}>
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
