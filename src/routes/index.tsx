import { createSignal, For, onCleanup, Suspense, onMount } from 'solid-js'
import { createAsync } from '@solidjs/router'
import { createStore } from 'solid-js/store'
import { Meta, Title, Link } from '@solidjs/meta'
import { useSession } from '../states/session'
import getTimeline from '../api/feed/getTimeline'
import FeedPost from '../components/Post'
import Spinner from '../components/Spinner'

const Timeline = () => {
	let ref: HTMLDivElement | undefined
	const [posts, setPosts] = createStore<
		Awaited<ReturnType<typeof getTimeline>>['feed']
	>([])
	const [cursor, setCursor] = createSignal('')
	const [tempCursor, setTempCursor] = createSignal('')
	const [_, setEnd] = createSignal(false)

	onMount(() => {
		const observer = new IntersectionObserver((entry) => {
			if (entry.length && entry[0].isIntersecting && posts.length) {
				setCursor(tempCursor())
			}
		})
		if (ref) observer.observe(ref)
		onCleanup(() => observer.disconnect())
	})

	const session = useSession()

	createAsync(async () => {
		const response = await getTimeline({
			limit: 10,
			cursor: cursor(),
			session: session
		})
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
				<div
					ref={ref!}
					style={{
						height: '1px',
						visibility: 'hidden'
					}}
				></div>
			</Suspense>
		</>
	)
}

export default Timeline
