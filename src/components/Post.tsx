import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import type { Thread, ThreadParentOrReply } from "../types";
import { did, id } from "../utils";
import Avatar from "./Avatar";
import styles from "./Post.module.css";
import PostFooter from "./PostFooter";
import TimeAgo from "./TimeAgo";
import Embed from "./embeds/Embed";

export const PostExpandedChildPost = (
	props: { hasChild?: boolean; hasParent?: boolean } & ThreadParentOrReply,
) => {
	return (
		<>
			<Show when={props?.parent}>
				{(parent) => (
					<>
						<PostExpandedChildPost
							{...parent()}
							hasParent={false}
							hasChild={true}
						/>
					</>
				)}
			</Show>
			<article
				class={styles.article}
				style={{
					"border-bottom":
						props.hasChild || (props?.replies && props.replies.length !== 0)
							? "none"
							: "1px solid var(--border)",
				}}
			>
				<div class={styles.inner}>
					<div class={styles.left}>
						<Show when={props.hasParent || Boolean(props?.parent)}>
							<div
								style={{
									position: "absolute",
									width: "2px",
									"background-color": "var(--border)",
									top: 0,
									height: "1.5rem",
								}}
							></div>
						</Show>
						<Avatar
							src={props?.post?.author?.avatar}
							alt={`${
								props?.post?.author?.displayName ??
								`@${props?.post?.author?.handle}`
							} avatar`}
						/>
						<Show
							when={
								props.hasChild || (props?.replies && props.replies.length !== 0)
							}
						>
							<div
								style={{
									position: "relative",
									width: "2px",
									"background-color": "var(--border)",
									"flex-grow": 1,
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
							</A>{" "}
							<A
								class={styles.handle}
								href={`/profile/${props?.post?.author?.handle}`}
							>
								@{props?.post?.author?.handle}
							</A>{" "}
							<TimeAgo time={new Date(props?.post?.record?.createdAt)} />
						</div>
						<div class={styles.content}>
							<Show when={props?.post?.record?.text}>
								{(text) => <p class={styles.text}>{text()}</p>}
							</Show>
							<Show when={props?.post.embed}>
								{(embed) => (
									<Embed embed={{ ...embed() }} did={did(props?.post?.uri)} />
								)}
							</Show>
						</div>
						<PostFooter
							styles={{
								"margin-top": "1rem",
							}}
							replyCount={props?.post?.replyCount}
							repostCount={props?.post?.repostCount}
							likeCount={props?.post?.likeCount}
						/>
					</div>
				</div>
				<A
					noScroll
					aria-label="Post"
					class={styles.wrapper}
					href={`/profile/${props?.post?.author?.handle}/post/${id(
						props.post?.uri,
					)}`}
				/>
			</article>
			<Show when={props?.replies}>
				{(replies) => (
					<For each={replies()}>
						{(reply) => <PostExpandedChildPost {...reply} hasParent={true} />}
					</For>
				)}
			</Show>
		</>
	);
};

export const Post = (
	props: { hasChild?: boolean; hasParent?: boolean } & Thread,
) => {
	return (
		<>
			<Show
				when={
					props?.reply?.parent?.cid === props?.reply?.root?.cid &&
					props?.reply?.parent
				}
			>
				{(post) => (
					<Post post={{ ...post() }} hasParent={false} hasChild={true} />
				)}
			</Show>
			<Show
				when={
					props?.reply?.parent?.cid !== props?.reply?.root?.cid && props?.reply
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

			<article
				class={styles.article}
				style={{
					"border-bottom": props.hasChild ? "none" : "1px solid var(--border)",
				}}
			>
				<div class={styles.inner}>
					<div class={styles.left}>
						<Show
							when={
								props.hasParent || (props.reply?.root && props.reply?.parent)
							}
						>
							<div
								style={{
									position: "absolute",
									width: "2px",
									"background-color": "var(--border)",
									top: 0,
									height: "1.5rem",
								}}
							></div>
						</Show>
						<Avatar
							src={props?.post?.author?.avatar}
							alt={`${
								props?.post?.author?.displayName ??
								`@${props?.post?.author.handle}`
							} avatar`}
						/>
						<Show when={props.hasChild}>
							<div
								style={{
									position: "relative",
									width: "2px",
									"background-color": "var(--border)",
									"flex-grow": 1,
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
							</A>{" "}
							<A
								class={styles.handle}
								href={`/profile/${props?.post?.author?.handle}`}
							>
								@{props?.post?.author?.handle}
							</A>{" "}
							<TimeAgo time={new Date(props?.post?.record?.createdAt)} />
						</div>
						<div class={styles.content}>
							<Show when={props?.post?.record?.text}>
								{(text) => <p class={styles.text}>{text()}</p>}
							</Show>
							<Show when={props?.post.embed}>
								{(embed) => (
									<Embed
										embed={{ ...embed() }}
										did={props?.post?.author?.did ?? did(props?.post?.uri)}
									/>
								)}
							</Show>
						</div>
						<PostFooter
							styles={{
								"margin-top": "1rem",
							}}
							replyCount={props?.post?.replyCount}
							repostCount={props?.post?.repostCount}
							likeCount={props?.post?.likeCount}
						/>
					</div>
				</div>
				<A
					aria-label="Post"
					class={styles.wrapper}
					href={`/profile/${props?.post?.author?.handle}/post/${id(
						props.post?.uri,
					)}`}
				/>
			</article>
		</>
	);
};

export default Post;
