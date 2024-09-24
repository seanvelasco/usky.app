import {
	ErrorBoundary,
	For,
	Show,
	createEffect,
	createSignal,
	lazy,
	Suspense
} from 'solid-js'
import { Title, Meta, Link } from '@solidjs/meta'
import {
	useLocation,
	A,
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
import Spinner from '../../../../../components/Spinner'
const RichText = lazy(() => import('../../../../../components/RichText'))
import { did, isDID } from '../../../../../utils'
import postStyles from '../../../../../components/Post.module.css'
import styles from './styles.module.css'
import type { ThreadParentOrReply, ThreadPost } from '../../../../../types'

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

const Timestamp = (props: { date: Date }) => (
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

const PostMeta = (props: { thread: ThreadPost }) => {
	const params = useParams()

	const title = () =>
		`${props.thread?.post?.author?.displayName ?? props.thread?.post?.author?.handle} (@${
			props.thread?.post?.author?.handle
		}) on Bluesky: "${props.thread?.post.record?.text}" - Bluesky (usky.app)`

	const description = () => props.thread?.post?.record?.text

	const url = () =>
		`https://usky.app/profile/${props.thread?.post?.author?.handle}/post/${params.post}`

	const image = () => {
		if (
			props.thread?.post?.embed?.$type === 'app.bsky.embed.images#view' ||
			props.thread?.post?.embed?.$type === 'app.bsky.embed.images'
		) {
			return {
				image:
					props.thread?.post.embed.images[0].thumb ??
					props.thread?.post?.embed.images[0].fullsize,
				aspectRatio: {
					width: props.thread?.post?.embed.images[0].aspectRatio
						?.width,
					height: props.thread?.post?.embed.images[0].aspectRatio
						?.height
				},
				alt: props.thread.post.embed.images[0].alt
			}
		} else if (
			props.thread?.post?.embed?.$type === 'app.bsky.embed.video#view'
		) {
			return {
				image: props.thread.post.embed.thumbnail,
				aspectRatio: {
					width: props.thread.post.embed.aspectRatio.width,
					height: props.thread.post.embed.aspectRatio.height
				}
			}
		}
		// todo: check official implementation if we display external embed preview
		return {
			image: props.thread.post.author.avatar,
			aspectRatio: {
				width: 100,
				height: 100
			}
		}
	}

	return (
		<ErrorBoundary fallback={<Title>{title()}</Title>}>
			<Title>{title()}</Title>
			<Meta name='description' content={description()} />
			<Meta property='og:title' content={title()} />
			<Meta property='og:description' content={description()} />
			<Meta property='og:url' content={url()} />
			<Meta property='og:image' content={image().image} />
			<Meta property='og:image:url' content={image().image} />
			<Meta property='og:image:secure_url' content={image().image} />
			<Meta
				property='og:image:width'
				content={image().aspectRatio.width?.toString()}
			/>
			<Meta
				property='og:image:height'
				content={image().aspectRatio.height?.toString()}
			/>
			<Show when={image().alt}>
				{(alt) => <Meta property='og:image:alt' content={alt()} />}
			</Show>
			<Meta property='og:image:type' content='image/jpeg' />
			<Show
				when={
					props.thread?.post?.embed?.$type ===
						'app.bsky.embed.video#view' && props.thread?.post?.embed
				}
			>
				{(video) => (
					<>
						<Meta property='og:video' content={video().playlist} />
						<Meta
							property='og:video:url'
							content={video().playlist}
						/>
						<Meta
							property='og:video:secure_url'
							content={video().playlist}
						/>
						<Meta
							property='og:video:type'
							content='application/x-mpegURL'
						/>
						<Meta
							property='og:video:width'
							content={video().aspectRatio.width.toString()}
						/>
						<Meta
							property='og:video:height'
							content={video().aspectRatio.height.toString()}
						/>
						<Meta name='twitter:card' content='player' />
						<Meta
							property='twitter:player'
							content={video().playlist}
						/>
						<Meta
							property='twitter:player:width'
							content={video().aspectRatio.width.toString()}
						/>
						<Meta
							property='twitter:player:height'
							content={video().aspectRatio.height.toString()}
						/>
					</>
				)}
			</Show>
			<Meta property='og:type' content='article' />
			<Meta
				property='article:published_time'
				content={props.thread?.post?.record?.createdAt}
			/>
			<Meta
				property='og:locale'
				content={props.thread?.post?.record?.langs?.[0]}
			/>
			<Meta
				property='article:author'
				content={
					props.thread?.post?.author?.displayName ||
					props.thread?.post?.author?.handle
				}
			/>
			<Meta
				property='article:tag'
				content={props.thread?.post?.record?.langs.join(', ')}
			/>
			<Meta name='twitter:title' content={title()} />
			<Meta name='twitter:description' content={description()} />
			<Meta property='twitter:url' content={url()} />
			<Meta name='twitter:image' content={image().image} />
			<Show when={image().alt}>
				{(alt) => <Meta property='twitter:image:alt' content={alt()} />}
			</Show>
			<Meta name='twitter:card' content='summary' />
			<Link rel='canonical' href={url()} />
		</ErrorBoundary>
	)
}

export const PostExpanded = (props: { thread: ThreadPost }) => {
	const [postRef, setPostRef] = createSignal<HTMLElement>()
	const [repliesRef, setRepliesRef] = createSignal<HTMLElement>()

	const [postHeight, setPostHeight] = createSignal<number>(
		postRef()?.clientHeight!
	)

	const [repliesHeight, setRepliesHeight] = createSignal<number>(
		repliesRef()?.clientHeight!
	)

	const location = useLocation()

	createEffect(async () => {
		console.log('postHeight', postHeight)
		console.log('repliesHeight', repliesHeight)

		if (location.pathname) {
			postRef() && setPostHeight(postRef()?.clientHeight!)
			repliesRef() && setRepliesHeight(repliesRef()?.clientHeight!)

			repliesRef()!.style.maxHeight = `100%`
			repliesRef()!.style.minHeight = `100%`

			postRef()?.scrollIntoView()
		}
	})

	return (
		<>
			<PostMeta thread={props.thread} />
			<Show when={props.thread.parent}>
				{(parent) => (
					<PostExpandedChildPost
						thread={parent()}
						hasChild={true}
						hasParent={false}
					/>
				)}
			</Show>
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
							<A
								rel='author'
								href={`/profile/${props.thread.post?.author?.handle}`}
							>
								<Avatar
									src={props.thread.post?.author?.avatar}
									alt={`${
										props.thread.post?.author
											?.displayName ??
										`@${props.thread.post?.author.handle}`
									} avatar`}
								/>
							</A>
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
							{(text) => (
								<p class={styles.text}>
									<RichText
										text={text()}
										facets={
											props?.thread?.post?.record?.facets
										}
									/>
								</p>
							)}
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
			<div ref={setRepliesRef}>
				<Show when={props.thread.replies}>
					{(replies) => (
						<For each={replies()}>
							{(reply) => (
								<PostExpandedChildPost thread={reply} />
							)}
						</For>
					)}
				</Show>
			</div>
		</>
	)
}

const PostPage = (props: RouteSectionProps) => {
	const data = createAsync(() =>
		getPostData({ profile: props.params.profile, post: props.params.post })
	)

	return (
		<Suspense fallback={<Spinner />}>
			<Show
				when={data()?.post?.thread}
				fallback={<p>Post does not exist or may be deleted</p>}
			>
				{(thread) => <PostExpanded thread={thread()} />}
			</Show>
		</Suspense>
	)
}

export default PostPage
