import { A } from '@solidjs/router'
import { For, Show, lazy, ErrorBoundary, Switch, Match } from 'solid-js'
import type { FeedPost, Thread, ThreadParentOrReply } from '../types'
import { did, id } from '../utils'
import Avatar from './Avatar'
import PostHeader from './PostHeader'
import PostFooter from './PostFooter'
import TimeAgo from './TimeAgo'
import Embed from './embeds/Embed'
const RichText = lazy(() => import('./RichText'))
import styles from './Post.module.css'

export const FallbackPost = (props: {
	post: ThreadParentOrReply | FeedPost | undefined
}) => (
	<Show when={props.post}>
		{(post) => (
			<A
				class={styles.fallback}
				href={`/profile/${did(post().uri)}/post/${id(post().uri)}`}
			>
				<p>
					<Switch fallback='Unable to display post'>
						<Match when={props.post?.notFound}>
							This post is deleted
						</Match>
						<Match when={props.post?.blocked}>
							Post hidden because one of the users involved
							blocked the other
						</Match>
					</Switch>
				</p>
			</A>
		)}
	</Show>
)

export const PostExpandedChildPost = (props: {
	hasChild?: boolean
	hasParent?: boolean
	thread: ThreadParentOrReply
}) => {
	return (
		<ErrorBoundary fallback={<FallbackPost post={props.thread} />}>
			<Show when={props?.thread.parent}>
				{(parent) => (
					<PostExpandedChildPost
						thread={parent()}
						hasParent={false}
						hasChild={true}
					/>
				)}
			</Show>
			<Show when={props.thread.post?.author}>
				<article
					class={styles.article}
					style={{
						'border-bottom':
							props.hasChild ||
							(props?.thread.replies &&
								props.thread.replies.length !== 0)
								? 'none'
								: '1px solid var(--border)'
					}}
				>
					<div class={styles.inner}>
						<div class={styles.left}>
							<Show
								when={
									props.hasParent ||
									Boolean(props?.thread.parent)
								}
							>
								<div
									style={{
										position: 'absolute',
										width: '2px',
										'background-color': 'var(--border)',
										top: 0,
										height: '1.5rem'
									}}
								></div>
							</Show>
							<A
								rel='author'
								href={`/profile/${props.thread.post?.author?.handle}`}
								class={styles.avatar}
							>
								<Avatar
									src={props?.thread.post?.author?.avatar}
									alt={`${
										props?.thread.post?.author
											?.displayName ??
										`@${props?.thread.post?.author?.handle}`
									} avatar`}
								/>
							</A>
							<Show
								when={
									props.hasChild ||
									(props?.thread.replies &&
										props.thread.replies.length !== 0)
								}
							>
								<div
									style={{
										position: 'relative',
										width: '2px',
										'background-color': 'var(--border)',
										'flex-grow': 1
									}}
								></div>
							</Show>
						</div>
						<div class={styles.right}>
							<div class={styles.header}>
								<A
									class={styles.name}
									href={`/profile/${props?.thread.post?.author?.handle}`}
								>
									{props?.thread.post?.author?.displayName ??
										props?.thread.post?.author?.handle}
								</A>{' '}
								<A
									class={styles.handle}
									href={`/profile/${props?.thread.post?.author?.handle}`}
								>
									@{props?.thread.post?.author?.handle}
								</A>{' '}
								<TimeAgo
									time={
										new Date(
											props?.thread.post?.record?.createdAt
										)
									}
								/>
							</div>
							<div class={styles.content}>
								<Show when={props?.thread.post?.record?.text}>
									{(text) => (
										<p class={styles.text}>
											<RichText
												text={text()}
												facets={
													props?.thread.post?.record
														?.facets
												}
											/>
										</p>
									)}
								</Show>
								<Show when={props?.thread.post.embed}>
									{(embed) => (
										<Embed
											embed={{ ...embed() }}
											did={did(props?.thread.post?.uri)}
										/>
									)}
								</Show>
							</div>
							\
							<PostFooter
								styles={{
									'margin-top': '1rem'
								}}
								replyCount={props?.thread.post?.replyCount}
								repostCount={props?.thread.post?.repostCount}
								likeCount={props?.thread.post?.likeCount}
							/>
						</div>
					</div>
					<A
						noScroll
						aria-label='Post'
						class={styles.wrapper}
						href={`/profile/${props?.thread.post?.author?.handle}/post/${id(
							props.thread.post?.uri
						)}`}
					/>
				</article>
			</Show>
			<Show when={props?.thread.replies}>
				{(replies) => (
					<For each={replies()}>
						{(reply) => (
							<PostExpandedChildPost
								thread={reply}
								hasParent={true}
							/>
						)}
					</For>
				)}
			</Show>
		</ErrorBoundary>
	)
}

export const Post = (
	props: { hasChild?: boolean; hasParent?: boolean } & Thread
) => {
	return (
		<ErrorBoundary fallback={<FallbackPost post={props.post} />}>
			<Show
				when={
					props?.reply?.parent?.cid === props?.reply?.root?.cid &&
					props?.reply?.parent
				}
			>
				{(post) => (
					<Post
						post={{ ...post() }}
						hasParent={false}
						hasChild={true}
					/>
				)}
			</Show>
			<Show
				when={
					props?.reply?.parent?.cid !== props?.reply?.root?.cid &&
					props?.reply
				}
			>
				{(reply) => (
					<>
						<Post
							post={{ ...reply().root }}
							hasParent={false}
							hasChild={true}
						/>
						<Post
							post={{ ...reply().parent }}
							hasParent={true}
							hasChild={true}
						/>
					</>
				)}
			</Show>
			<Show
				when={props?.post?.author}
				fallback={<FallbackPost post={props?.post} />}
			>
				<article
					class={styles.article}
					style={{
						'border-bottom': props.hasChild
							? 'none'
							: '1px solid var(--border)',
						...(props.reason && { 'padding-top': '1.25rem' })
					}}
				>
					<Show when={props.reason?.by}>
						{(actor) => <PostHeader actor={actor()} />}
					</Show>
					<div class={styles.inner}>
						<div class={styles.left}>
							<Show
								when={
									props.hasParent ||
									(props.reply?.root && props.reply?.parent)
								}
							>
								<div
									style={{
										position: 'absolute',
										width: '2px',
										'background-color': 'var(--border)',
										top: 0,
										height: '1.5rem'
									}}
								></div>
							</Show>
							<A
								rel='author'
								href={`/profile/${props.post?.author?.handle}`}
								class={styles.avatar}
							>
								<Avatar
									src={props?.post?.author?.avatar}
									alt={`${
										props?.post?.author?.displayName ??
										`@${props?.post?.author.handle}`
									} avatar`}
								/>
							</A>
							<Show when={props.hasChild}>
								<div
									style={{
										position: 'relative',
										width: '2px',
										'background-color': 'var(--border)',
										'flex-grow': 1
									}}
								></div>
							</Show>
						</div>
						<div class={styles.right}>
							<div class={styles.header}>
								<A
									class={styles.name}
									href={`/profile/${props?.post?.author?.handle}`}
								>
									{props?.post?.author?.displayName ??
										props?.post?.author?.handle}
								</A>{' '}
								<A
									class={styles.handle}
									href={`/profile/${props?.post?.author?.handle}`}
								>
									@{props?.post?.author?.handle}
								</A>{' '}
								<TimeAgo
									time={
										new Date(props?.post?.record?.createdAt)
									}
								/>
							</div>
							<div class={styles.content}>
								<Show when={props?.post?.record?.text}>
									{(text) => (
										<p class={styles.text}>
											<RichText
												text={text()}
												facets={
													props?.post?.record?.facets
												}
											/>
										</p>
									)}
								</Show>
								<Show when={props?.post.embed}>
									{(embed) => (
										<Embed
											embed={{ ...embed() }}
											did={
												props?.post?.author?.did ??
												did(props?.post?.uri)
											}
										/>
									)}
								</Show>
							</div>
							<PostFooter
								styles={{
									'margin-top': '1rem'
								}}
								replyCount={props?.post?.replyCount}
								repostCount={props?.post?.repostCount}
								likeCount={props?.post?.likeCount}
							/>
						</div>
					</div>
					<A
						aria-label='Post'
						class={styles.wrapper}
						href={`/profile/${props?.post?.author?.handle}/post/${id(
							props.post?.uri
						)}`}
					/>
				</article>
			</Show>
		</ErrorBoundary>
	)
}

export default Post
