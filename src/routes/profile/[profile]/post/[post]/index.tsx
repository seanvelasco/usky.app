import {
	ErrorBoundary,
	For,
	Show,
	createEffect,
	createSignal,
	onMount
} from 'solid-js'
import { Title, Meta, Link } from '@solidjs/meta'
import {
	A,
	useLocation,
	createAsync,
	cache,
	useParams,
	type RouteSectionProps
} from '@solidjs/router'
import Avatar from '../../../../../components/Avatar'
import { PostExpandedChildPost } from '../../../../../components/Post'
import PostFooter from '../../../../../components/PostFooter'
import Embed from '../../../../../components/embeds/Embed'
import getPostThread from '../../../../../api/feed/getPostThread'
import resolveHandle from '../../../../../api/identity/resolveHandle'
import { did, isDID } from '../../../../../utils'
import Spinner from '../../../../../components/Spinner.tsx'
import postStyles from '../../../../../components/Post.module.css'
import styles from './styles.module.css'
import type { ThreadParentOrReply, ThreadPost } from '../../../../../types'

const Timestamp = (props: { date: Date }) => {
	return (
		<time
			style={{
				color: 'var(--text-secondary)'
			}}
		>
			{props.date.toLocaleDateString('en-us', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})}{' '}
			at{' '}
			{props.date.toLocaleTimeString([], {
				hour: 'numeric',
				minute: 'numeric'
			})}
		</time>
	)
}

const PostExpanded = (props: { thread: ThreadPost }) => {
	const params = useParams()
	const [postRef, setPostRef] = createSignal<HTMLElement>()
	const [repliesRef, setRepliesRef] = createSignal<HTMLElement>()

	const [postHeight, setPostHeight] = createSignal<number>(
		postRef()?.clientHeight!
	)

	const [repliesHeight, setRepliesHeight] = createSignal<number>(
		repliesRef()?.clientHeight!
	)

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

	const [title] = createSignal(
		`${props.thread?.post?.author?.displayName ?? props.thread?.post?.author?.handle} (@${
			props.thread?.post?.author?.handle
		}) on Bluesky: "${props.thread?.post.record?.text}" - Bluesky (usky.app)`
	)
	const [url] = createSignal(
		`https://usky.app/profile/${props.thread?.post?.author?.handle}/post/${params.post}`
	)

	return (
		<>
			<ErrorBoundary fallback={<Title>{title()}</Title>}>
				<Title>{title()}</Title>
				<Meta
					name='description'
					content={props.thread.post?.record?.text}
				/>

				<Meta property='og:title' content={title()} />
				<Meta
					property='og:description'
					content={props.thread?.post?.record?.text}
				/>
				<Meta property='og:url' content={url()} />
				<Meta
					property='og:image'
					content={props.thread?.post?.author?.avatar}
				/>
				<Meta property='og:image:type' content='image/jpeg' />
				<Meta property='og:type' content='article' />
				<Meta
					property='article:published_time'
					content={props.thread?.post?.record?.createdAt}
				/>
				<Meta
					property='article:author'
					content={
						props.thread?.post?.author?.displayName ??
						props.thread?.post?.author?.handle
					}
				/>
				<Meta name='twitter:title' content={title()} />
				<Meta
					name='twitter:description'
					content={props.thread?.post?.record?.text}
				/>
				<Meta property='twitter:url' content={url()} />
				<Meta
					name='twitter:image'
					content={props.thread?.post?.author?.avatar}
				/>
				<Meta name='twitter:card' content='summary' />

				<Link rel='canonical' href={url()} />
			</ErrorBoundary>
			<ErrorBoundary
				fallback={(error) => (
					<div class={styles.error}>
						<code>
							Unable to load parent thread: {error?.message}
						</code>
					</div>
				)}
			>
				<Show when={props.thread.parent}>
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
						<code>
							Unable to load main thread: {error?.message}
						</code>
					</div>
				)}
			>
				<article
					ref={setPostRef}
					id={props.thread?.post?.uri}
					class={styles.article}
				>
					<div class={postStyles.inner}>
						<div
							style={{
								position: 'relative',
								display: 'flex',
								'flex-direction': 'column',
								'align-items': 'center'
							}}
						>
							<Show when={props.thread?.parent}>
								<div
									style={{
										position: 'absolute',
										width: '2px',
										'background-color': 'var(--border)',
										top: '-1.5rem',
										height: '1.5rem'
									}}
								/>
							</Show>
							<Avatar
								src={props.thread.post?.author?.avatar}
								alt={`${
									props.thread.post?.author?.displayName ??
									`@${props.thread.post?.author.handle}`
								} avatar`}
							/>
						</div>
						<div class={styles.header}>
							<A
								rel='author'
								href={`/profile/${props.thread.post?.author?.handle}`}
								class={postStyles.name}
							>
								{props.thread.post?.author?.displayName ??
									props.thread.post?.author?.handle}
							</A>
							<A
								rel='author'
								href={`/profile/${props.thread.post?.author?.handle}`}
								class={postStyles.handle}
							>
								@{props.thread.post?.author?.handle}
							</A>
						</div>
					</div>
					<div class={postStyles.content}>
						<Show when={props.thread.post?.record?.text}>
							{(text) => <p class={styles.text}>{text()}</p>}
						</Show>
						<Show when={props.thread.post.embed}>
							{(embed) => (
								<Embed
									embed={embed()}
									did={did(props.thread.post?.uri)}
								/>
							)}
						</Show>
						<Timestamp
							date={new Date(props.thread.post.record.createdAt)}
						/>
					</div>
					<PostFooter
						styles={{
							'padding-top': '1rem',
							'border-top': '1px solid var(--border)',
							'justify-content': 'center'
						}}
						replyCount={props.thread.post?.replyCount}
						repostCount={props.thread.post?.repostCount}
						likeCount={props.thread.post?.likeCount}
					/>
				</article>
			</ErrorBoundary>
			<ErrorBoundary
				fallback={(error) => (
					<div class={styles.error}>
						<code>
							Unable to load child thread: {error?.message}
						</code>
					</div>
				)}
			>
				<Show when={props.thread.replies}>
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
	profile,
	post
}: {
	profile: string
	post: string
}) => {
	const did = isDID(profile) ? profile : await resolveHandle(profile)

	const postThread = await getPostThread(
		`at://${did}/app.bsky.feed.post/${post}`
	)

	const actors: ThreadPost['post']['author'][] = []

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

	if (postThread.thread) {
		pushAuthors(postThread.thread)
		actors.reverse()
	}

	return {
		post: postThread,
		actors
	}
}

export const getPostData = cache(
	async ({ profile, post }: { profile: string; post: string }) =>
		await getThread({ profile, post }),
	'post'
)

const PostPage = (props: RouteSectionProps) => {
	const data = createAsync(() =>
		getPostData({ profile: props.params.profile, post: props.params.post })
	)

	return (
		<Show when={data()?.post?.thread} fallback={<Spinner />}>
			{(thread) => <PostExpanded thread={thread()} />}
		</Show>
	)
}

export default PostPage
