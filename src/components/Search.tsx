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
import { ListItem } from './Section'
import listStyles from './Section.module.css'
import Spinner from './Spinner'

const typeaheadSearch = cache(
	async (query: string) => await searchActorsTypeahead(query),
	'typeahead_search'
)

const goToSearch = action(async (query: string) => {
	throw redirect(`/search?q=${encodeURIComponent(query)}`)
})

// This same search input component is used in the /search page as well as
// in the sidebar for other pages
const Search = () => {
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
		if (params.hashtag) setQuery(decodeURIComponent(`#${params.hashtag}`))
	})

	// On input, there are three possible behaviors
	// If on the search page, every input sets the search params
	// search params are tracked; every change results in a cache invalidation
	// If on the hashtag page, navigate to the search page and use its behavior
	// If on the sidebar (typeahead), every input sets a query signal
	// in the same input listener,
	const onSearch = async (event: Event) => {
		const { value } = event.target as HTMLInputElement

		if (isHashtagPage()) {
			await navigate('/search')
		}

		if (isSearchOrHashtagPage()) {
			// .trim() has UX issues when a user tries to search for a sentence
			// search input automatically strips space even if there is user intent to have spaces
			// possible solution is to just .trim() in the API call and not override UI
			setSearchParams({ q: value }) // tried to remove .trim()
		} else {
			// Do we need to use this query signal?
			// Can't we just pass this to typeaheadSearch() and set the results
			// Todo - explain decodeURIComponent vs encodeURIComponent in this context
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
				<div
					class={listStyles.section}
					style={{
						'max-height': 'unset'
					}}
				>
					{/* Todo: investigate why this Suspense is never triggered */}
					<Suspense fallback={<Spinner />}>
						<A
							class={`${listStyles.item} ${listStyles.more}`}
							href={`/search?q=${encodeURIComponent(query())}`}
						>
							Search for "{query()}"
						</A>
						<For each={results()?.actors}>
							{(actor) => {
								if (actor.handle === 'handle.invalid') {
									actor.handle = actor.did
								}
								return (
									<ListItem
										name={
											actor?.displayName ?? actor.handle
										}
										handle={actor?.handle}
										avatar={actor.avatar ?? '/avatar.svg'}
										href={`/profile/${actor.handle}`}
									/>
								)
							}}
						</For>
					</Suspense>
				</div>
			</Show>
		</>
	)
}

export default Search
