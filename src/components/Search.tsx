import { createSignal, Show, For, Suspense, createEffect } from 'solid-js'
import {
	useSearchParams,
	A,
	useMatch,
	action,
	redirect,
	useAction,
	useParams,
	useNavigate,
	useBeforeLeave
} from '@solidjs/router'
import searchActorsTypeahead from '../api/actor/searchActorsTypeahead'
import { ListItem } from './Section'
import Spinner from './Spinner'
import styles from './Search.module.css'
import listStyles from './Section.module.css'

const goToSearch = action(async (query: string) => {
	throw redirect(`/search?q=${encodeURIComponent(query)}`)
})

// This same search input component is used in the /search page as well as
// in the sidebar for other pages
const Search = () => {
	const [results, setSearchResults] =
		createSignal<Awaited<ReturnType<typeof searchActorsTypeahead>>>()
	const navigate = useNavigate()
	const isSearchPage = useMatch(() => '/search/*')
	const isHashtagPage = useMatch(() => '/hashtag/:hashtag')
	const isSearchOrHashtagPage = () => isSearchPage() || isHashtagPage()
	const params = useParams()
	const [searchParams, setSearchParams] = useSearchParams()
	const [query, setQuery] = createSignal('')

	createEffect(() => {
		if (searchParams.q) {
			setQuery(searchParams.q as string)
		}
		if (params.hashtag) {
			setQuery(decodeURIComponent(`#${params.hashtag}`))
		}
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

		if (isSearchPage()) {
			setSearchParams({ q: value })
		} else {
			setQuery(decodeURIComponent(value.trim()))
			setSearchResults(
				await searchActorsTypeahead(encodeURIComponent(query()))
			)
		}
	}

	const search = useAction(goToSearch)

	const onSubmit = async (event: Event) => {
		event.preventDefault()
		if (isSearchOrHashtagPage()) return
		await search(query())
	}

	useBeforeLeave(() => {
		if (!isSearchOrHashtagPage()) {
			setQuery('')
		}
	})

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
			<Show when={query() && !(isSearchPage() || isHashtagPage())}>
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
