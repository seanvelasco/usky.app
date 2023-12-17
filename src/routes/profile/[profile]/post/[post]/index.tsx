import { Link, Meta, Title } from "@solidjs/meta"
import {
	A,
	type RouteDataFuncArgs,
	useLocation,
	useParams,
	useRouteData
} from "@solidjs/router"
import {
	ErrorBoundary,
	For,
	Show,
	createEffect,
	createResource,
	createSignal,
	onMount
} from "solid-js"
import getPostThread from "../../../../../api/feed/getPostThread"
import resolveHandle from "../../../../../api/identity/resolveHandle"
import Avatar from "../../../../../components/Avatar"
import { PostExpandedChildPost } from "../../../../../components/Post"
import postStyles from "../../../../../components/Post.module.css"
import PostFooter from "../../../../../components/PostFooter"
import Embed from "../../../../../components/embeds/Embed"
import { did } from "../../../../../utils"
import type { ThreadParentOrReply, ThreadPost } from "../../../../../types"
import styles from "./styles.module.css"

const Timestamp = (props: { date: Date }) => {
	// const date = createMemo(() => new Date(props.date))

	return (
		<time
			style={{
				color: "var(--text-secondary)"
			}}
		>
			{props.date.toLocaleDateString("en-us", {
				year: "numeric",
				month: "short",
				day: "numeric"
			})}{" "}
			at{" "}
			{props.date.toLocaleTimeString([], {
				hour: "numeric",
				minute: "numeric"
			})}
		</time>
	)
}

const PostExapnded = (props: ThreadPost) => {
	const params = useParams()

	const [postRef, setPostRef] = createSignal<HTMLElement>()
	const [repliesRef, setRepliesRef] = createSignal<HTMLElement>()

	const [postHeight, setPostHeight] = createSignal<number>(
		postRef()?.clientHeight!
	)

	const [repliesHeight, setRepliesHeight] = createSignal<number>(
		repliesRef()?.clientHeight!
	)

	createEffect(() => {
		console.log(postRef()?.clientHeight!)
		console.log(repliesRef()?.clientHeight!)
	})

	// const scrollToPost = () => postRef()?.scrollIntoView()

	createEffect(() => {
		postRef() && setPostHeight(postRef()?.clientHeight!)
		repliesRef() && setRepliesHeight(repliesRef()?.clientHeight!)
		console.log(
			postRef()?.clientHeight,
			postHeight(),
			postRef()?.id,
			postHeight() + repliesHeight() + 61,
			useLocation().pathname
		)
		postRef()?.scrollIntoView()
	})

	onMount(() => {
		setPostHeight(postRef()?.clientHeight!)
		setRepliesHeight(repliesRef()?.clientHeight!)
		postRef()?.scrollIntoView()
	})

	// $: url =

	const [title] = createSignal(
		`${props?.post?.author?.displayName ?? props?.post?.author?.handle} (@${
			props?.post?.author?.handle
		}) on Bluesky: "${props?.post?.record?.text}" - Bluesky (usky.app)`
	)
	const [url] = createSignal(
		`https://usky.app/profile/${props?.post?.author?.handle}/post/${params.post}`
	)

	return (
		<>
			<Title>{title()}</Title>
			<Meta name="description" content={props.post?.record?.text} />

			<Meta property="og:title" content={title()} />
			<Meta
				property="og:description"
				content={props?.post?.record?.text}
			/>
			<Meta property="og:url" content={url()} />
			<Meta property="og:image" content={props?.post?.author?.avatar} />
			<Meta property="og:image:type" content="image/jpeg" />
			<Meta property="og:type" content="article" />
			<Meta
				property="article:published_time"
				content={props?.post?.record?.createdAt}
			/>
			<Meta
				property="article:author"
				content={
					props?.post?.author?.displayName ??
					props?.post?.author?.handle
				}
			/>
			<Meta name="twitter:title" content={title()} />
			<Meta
				name="twitter:description"
				content={props?.post?.record?.text}
			/>
			<Meta property="twitter:url" content={url()} />
			<Meta name="twitter:image" content={props?.post?.author?.avatar} />
			<Meta name="twitter:card" content="summary" />

			<Link rel="canonical" href={url()} />
			<ErrorBoundary
				fallback={(error) => (
					<div class={styles.error}>
						<code>Error occured: {error?.message}</code>
					</div>
				)}
			>
				<Show when={props.parent}>
					{(parent) => (
						<PostExpandedChildPost
							{...parent()}
							hasChild={true}
							hasParent={false}
						/>
					)}
				</Show>
			</ErrorBoundary>
			<ErrorBoundary
				fallback={(error) => (
					<div class={styles.error}>
						<code>Error occured: {error?.message}</code>
					</div>
				)}
			>
				<article
					ref={setPostRef}
					id={props?.post?.uri}
					class={styles.article}
				>
					<div class={postStyles.inner}>
						<div
							style={{
								position: "relative",
								display: "flex",
								"flex-direction": "column",
								"align-items": "center"
							}}
						>
							<Show when={props?.parent}>
								<div
									style={{
										position: "absolute",
										width: "2px",
										"background-color": "var(--border)",
										top: "-1.5rem",
										height: "1.5rem"
									}}
								/>
							</Show>
							<Avatar
								src={props.post?.author?.avatar}
								alt={`${
									props.post?.author?.displayName ??
									`@${props.post?.author.handle}`
								} avatar`}
							/>
						</div>
						<div class={styles.header}>
							<A
								rel="author"
								href={`/profile/${props.post?.author?.handle}`}
								class={postStyles.name}
							>
								{props.post?.author?.displayName ??
									props.post?.author?.handle}
							</A>
							<A
								rel="author"
								href={`/profile/${props.post?.author?.handle}`}
								class={postStyles.handle}
							>
								@{props.post?.author?.handle}
							</A>
						</div>
					</div>
					<div class={postStyles.content}>
						<Show when={props.post?.record?.text}>
							{(text) => <p class={styles.text}>{text()}</p>}
						</Show>
						<Show when={props.post.embed}>
							{(embed) => (
								<Embed
									embed={{ ...embed() }}
									did={did(props.post?.uri)}
								/>
							)}
						</Show>
						<Timestamp
							date={new Date(props.post.record.createdAt)}
						/>
					</div>
					<PostFooter
						styles={{
							"padding-top": "1rem",
							"border-top": "1px solid var(--border)",
							"justify-content": "center"
						}}
						replyCount={props.post?.replyCount}
						repostCount={props.post?.repostCount}
						likeCount={props.post?.likeCount}
					/>
				</article>
			</ErrorBoundary>
			<ErrorBoundary
				fallback={(error) => (
					<div class={styles.error}>
						<code>Error occured: {error?.message}</code>
					</div>
				)}
			>
				<Show when={props.replies}>
					{(replies) => (
						<div ref={setRepliesRef}>
							<For each={replies()}>
								{(reply) => (
									<PostExpandedChildPost {...reply} />
								)}
							</For>
						</div>
					)}
				</Show>
			</ErrorBoundary>
		</>
	)
}

const getThread = async ({
	profileId,
	postId
}: {
	profileId: string
	postId: string
}) => {
	const did = await resolveHandle(profileId)

	const post = await getPostThread(`at://${did}/app.bsky.feed.post/${postId}`)

	const actors: ThreadPost["post"]["author"][] = []

	const pushAuthors = (thread: ThreadPost | ThreadParentOrReply) => {
		if (
			!actors.some((author) => author.did === thread?.post?.author?.did)
		) {
			actors.push(thread?.post?.author)
		}

		if (thread?.parent) {
			pushAuthors(thread?.parent)
		}
	}

	if (post.thread) {
		pushAuthors(post.thread)
		actors.reverse()
	}

	return {
		post,
		actors
	}
}

export const PostData = ({ params }: RouteDataFuncArgs) => {
	const [postData] = createResource(
		() => ({
			profileId: params.profile,
			postId: params.post
		}),
		getThread
	)

	return postData
}

const PostPage = () => {
	const data = useRouteData<typeof PostData>()

	if (data.error) {
		return <p>Unable to retrieve posts</p>
	}

	return (
		<Show when={data()?.post?.thread}>
			{(thread) => <PostExapnded {...thread()} />}
		</Show>
	)
}

export default PostPage
