import { onMount, onCleanup, For, createSignal } from "solid-js"
import Post from "../../components/Post"
import Spinner from "../../components/Spinner"
import { CarReader } from "@ipld/car"
import { decode } from "@ipld/dag-cbor"
import { decodeMultiple } from "cbor-x"
import type { ThreadParentOrReply} from "../../types"

const BASE_URL = "wss://bsky.network/xrpc/com.atproto.sync.subscribeRepos"

const shape = (event: {
	did: string
	text: string
	timestamp: Date
	path: string
}): ThreadParentOrReply => {
	console.log('asd')
	return {
		post: {
			uri: event.path,
			cid: event.path,
			author: {
				did: event.did,
				handle: event.did,
				labels: []
			},
			record: {
				text: event.text,
				createdAt: event.timestamp.toISOString(),
				langs: []
			},
			replyCount: 0,
			repostCount: 0,
			likeCount: 0,
			indexedAt: event.timestamp.toISOString(),
			labels: []
		}
	}
}

const handleRepo = async (message: any) => {
	const {
		ops,
		repo,
		time,
		blocks
	} = message
	
	if (blocks) {
		const reader = await CarReader.fromBytes(blocks)
		for (const op of ops) {
			const { cid, path, action } = op
			if (action === 'create') {
				if (cid) {
					for await (const { cid: cid2 } of reader.blocks()) {
						const block = await reader.get(cid2)
						if (block) {
							const decoded = decode(block?.bytes) as any
							if (decoded.$type === "app.bsky.feed.post") {
								return {
									did: repo,
									text: decoded.text,
									timestamp: new Date(time),
									path
								}
							}
						}
					}
				}
			}
		}
	}
}

const handleCBOR = async (message: ArrayBuffer) => {
	const decoded: unknown[] = []
	decodeMultiple(new Uint8Array(message), (value) => decoded.push(value))
	const [header, payload]: any = decoded
	if (header.op === 1 && header.t === '#commit' && payload) {
		const repo = await handleRepo(payload)
		if (repo) {
			return repo
		}
	}
}

const Firehose = () => {
	
	const [posts, setPosts] = createSignal<any[]>([])
	
	const onMessage = async ({ data }: MessageEvent<ArrayBuffer>) => {
		const decoded = await handleCBOR(data)
		if (decoded) {
			setPosts([...posts(), shape(decoded)])
		}
	}
	
	onMount(() => {
		const ws = new WebSocket(BASE_URL)
		ws.binaryType = "arraybuffer"
		ws.onmessage = onMessage
		onCleanup(() => ws.close())
	})
	
	return <div>
		<For each={posts()} fallback={<Spinner />}>
			{(post) => <Post {...post} />}
		</For>
	</div>
}

export default Firehose