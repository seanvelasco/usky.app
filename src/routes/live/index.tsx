import { onMount, onCleanup, For, createSignal } from 'solid-js'

import Post from '../../components/Post'
import Spinner from '../../components/Spinner'

import { CarReader } from '@ipld/car'
import { decode } from '@ipld/dag-cbor'
import { decodeMultiple } from 'cbor-x'

import type { FirehosePost, FeedPost, FirehosePayload, Header, Payload } from '../../types'

const FIREHOSE_BASE_URL = 'wss://bsky.network/xrpc/com.atproto.sync.subscribeRepos'

const shape = (post: FirehosePayload): FeedPost => (
	{
		uri: post.path,
		cid: post.path,
		author: {
			did: post.did,
			handle: post.did,
			labels: []
		},
		record: {
			text: post.text,
			createdAt: post.createdAt,
			langs: post.langs
		},
		replyCount: 0,
		repostCount: 0,
		likeCount: 0,
		indexedAt: post.createdAt,
		labels: []
	}
)


const handleRepo = async (message: Payload) => {
	const { ops, repo, blocks } = message

	if (blocks) {
		const reader = await CarReader.fromBytes(blocks)
		for (const op of ops) {
			const { cid, path, action } = op
			if (action === 'create' && cid) {
				for await (const { cid: cid2 } of reader.blocks()) {
					const block = await reader.get(cid2)
					if (block) {
						const decoded = decode(block.bytes) as FirehosePost
						if (decoded.$type === 'app.bsky.feed.post') {
							return {
								did: repo,
								path: path,
								...decoded
							}
						}
					}
				}
			}
		}
	}
}

const handleCBOR = async (message: ArrayBuffer) => {
	const decoded = [] as unknown as [Header, Payload]
	decodeMultiple(new Uint8Array(message), (value) => decoded.push(value))
	const [header, payload] = decoded
	if (header.op === 1 && header.t === '#commit' && payload) {
		return handleRepo(payload)
	}
}

const Firehose = () => {
	const [posts] = createSignal<FeedPost[]>([])

	const onMessage = async ({ data }: MessageEvent<ArrayBuffer>) => {
		const decoded = await handleCBOR(data)
		if (decoded) posts().push(shape(decoded))
	}

	onMount(() => {
		const ws = new WebSocket(FIREHOSE_BASE_URL)
		ws.binaryType = 'arraybuffer'
		ws.onmessage = onMessage
		onCleanup(() => ws.close())
	})

	return (
		<For each={posts().reverse()} fallback={<Spinner />}>
			{post => <Post post={post} />}
		</For>
	)
}

export default Firehose

// TODO
// figure out how to make cbox-x decode() behave like @ipld/dag-cbor decode()
// investigate cost of solis.js components
// experiment For-ing components, For-ing elements, appending elements from templates