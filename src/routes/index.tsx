import {
	Accessor,
	batch,
	createEffect,
	createSignal,
	For,
	onCleanup,
	Show,
	Suspense
} from 'solid-js'
import { createAsync, RouteSectionProps } from '@solidjs/router'
import { Meta, Title, Link } from '@solidjs/meta'
import getFeed from '../api/feed/getFeed'
import FeedPost from '../components/Post'

type t = Awaited<ReturnType<typeof getFeed>>['feed']

type r = [
	setRef: (element: Element) => void,
	posts: Accessor<t>,
	end: Accessor<boolean>
]

// const createInfiniteScroll = (): r => {

// 	return [setRef, posts, end]
// }

const Discover = (props: RouteSectionProps) => {
	const feeds: Record<string, string> = {
		'/': 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot',
		'/hot': 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/hot-classic'
	}

	const [posts, setPosts] = createSignal<t>([])
	const [cursor, setCursor] = createSignal('')
	// const [end, setEnd] = createSignal(false)

	const io = new IntersectionObserver((entry) => {
		if (entry.length && entry[0].isIntersecting) {
			setCursor(response()?.cursor as string)
		}
	})

	onCleanup(() => io.disconnect())

	const setRef = (element: Element) => {
		io.observe(element)
	}

	const response = createAsync(() =>
		getFeed(feeds[props.location.pathname] || feeds[0], 5, cursor())
	)

	createEffect(() => {
		if (response()?.feed) {
			batch(() => {
				setPosts((prev) => [...prev, ...(response()?.feed as t)])
			})
		}
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
			<Suspense>
				<For each={posts()}>{(post) => <FeedPost {...post} />}</For>
				<Show when={posts().length}>
					<div
						style={{
							visibility: 'hidden'
						}}
						ref={setRef}
					></div>
				</Show>
			</Suspense>
		</>
	)
}

export default Discover
