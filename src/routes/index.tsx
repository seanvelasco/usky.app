import { Show, createSignal, For, onCleanup, Suspense, onMount } from 'solid-js'
import { createAsync } from '@solidjs/router'
import { createStore } from 'solid-js/store'
import { Meta, Title, Link } from '@solidjs/meta'
import getFeed from '../api/feed/getFeed'
import FeedPost from '../components/Post'
import Spinner from '../components/Spinner'

const Discover = () => {
	let ref: HTMLDivElement
	const [posts, setPosts] = createStore<
		Awaited<ReturnType<typeof getFeed>>['feed']
	>([])
	const [cursor, setCursor] = createSignal('')
	const [tempCursor, setTempCursor] = createSignal('')
	const [end, setEnd] = createSignal(false)

	onMount(() => {
		const observer = new IntersectionObserver((entry) => {
			if (entry.length && entry[0].isIntersecting) {
				setCursor(tempCursor())
			}
		})
		if (ref) observer.observe(ref)
		onCleanup(() => observer.disconnect())
	})

	createAsync(async () => {
		const response = await getFeed(
			'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot',
			5,
			cursor()
		)
		if (response.feed.length)
			setPosts((prev) => [...prev, ...response.feed])

		if (response.cursor) setTempCursor(response.cursor)
		else setEnd(true)
	})

	return (
		<>
			<Title>Bluesky (usky.app)</Title>
			<Meta
				name='description'
				content="Minimalist web client for the decentralized social network Bluesky - see what's happening, discover new things, and look up people you know."
			/>
			<Meta property='og:title' content='Bluesky (usky.app)' />
			<Meta
				property='og:description'
				content="Minimalist web client for the decentralized social network Bluesky - see what's happening, discover new things, and look up people you know."
			/>
			<Meta property='og:url' content='https://usky.app' />
			<Meta name='twitter:title' content='Bluesky (usky.app)' />
			<Meta
				name='twitter:description'
				content={
					"Minimalist web client for the decentralized social network Bluesky - see what's happening, discover new things, and look up people you know."
				}
			/>
			<Meta property='twitter:url' content='https://usky.app' />
			<Link rel='canonical' href='https://usky.app' />
			<Suspense fallback={<Spinner />}>
				<For each={posts}>{(post) => <FeedPost {...post} />}</For>
				<Show when={!end()}>
					<div
						ref={ref!}
						style={{
							height: '1px',
							visibility: 'hidden'
						}}
					></div>
				</Show>
			</Suspense>
		</>
	)
}

export default Discover
