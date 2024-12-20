import { createSignal, For, onCleanup, Suspense, onMount } from 'solid-js'
import { createAsync } from '@solidjs/router'
import { createStore } from 'solid-js/store'
import { Meta, Title, Link } from '@solidjs/meta'
import getFeed from '../../api/feed/getFeed'
import FeedPost from '../../components/Post'
import Spinner from '../../components/Spinner'
import { useSession } from '../../states/session'

const Hot = () => {
	let ref: HTMLDivElement | undefined
	const [posts, setPosts] = createStore<
		Awaited<ReturnType<typeof getFeed>>['feed']
	>([])
	const [cursor, setCursor] = createSignal('')
	const [tempCursor, setTempCursor] = createSignal('')
	const [_, setEnd] = createSignal(false)

	const session = useSession()

	onMount(() => {
		const observer = new IntersectionObserver((entry) => {
			if (entry.length && entry[0].isIntersecting && posts.length) {
				setCursor(tempCursor())
			}
		})
		if (ref) observer.observe(ref)
		onCleanup(() => observer.disconnect())
	})

	createAsync(async () => {
		const response = await getFeed({
			feed: 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/hot-classic',
			limit: 10,
			cursor: cursor(),
			token: session.accessJwt
		})
		if (response.feed.length)
			setPosts((prev) => [...prev, ...response.feed])

		if (response.cursor) setTempCursor(response.cursor)
		else setEnd(true)
	})

	const title = () => "What's Hot - Bluesky (usky.app)"
	const description = () => "What's Hot in Bluesky"
	const url = () => 'https://usky.app/hot'

	return (
		<>
			<Title>{title()}</Title>
			<Meta name='description' content={description()} />
			<Meta property='og:title' content={title()} />
			<Meta property='og:description' content={description()} />
			<Meta property='og:url' content={url()} />
			<Meta name='twitter:title' content={title()} />
			<Meta name='twitter:description' content={description()} />
			<Meta property='twitter:url' content={url()} />
			<Link rel='canonical' href={url()} />
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

export default Hot
