import { Show } from "solid-js/web"
import { LikesIcon } from "../assets/likes"
import { RepostsIcon } from "../assets/reposts"
import { RepliesIcon } from "../assets/replies"
import styles from "./PostFooter.module.css"

import type { JSX } from "solid-js"

const PostFooter = (props: {
	replyCount: number
	repostCount: number
	likeCount: number
	styles?: JSX.CSSProperties
}) => {
	return (
		<div class={styles.footer} style={props.styles}>
			<div class={styles.wrapper}>
				<button
					class={styles.button}
					aria-label={`${props.replyCount.toLocaleString()} replies`}
				>
					<RepliesIcon />
				</button>
				<Show when={props.replyCount !== 0}>
					{props.replyCount.toLocaleString()}
				</Show>
			</div>
			<div class={styles.wrapper}>
				<button
					class={styles.button}
					aria-label={`${props.repostCount.toLocaleString()} reposts`}
				>
					<RepostsIcon />
				</button>
				<Show when={props.repostCount !== 0}>
					{props.repostCount.toLocaleString()}
				</Show>
			</div>
			<div class={styles.wrapper}>
				<button
					class={styles.button}
					aria-label={`${props.likeCount.toLocaleString()} likes`}
				>
					<LikesIcon />
				</button>
				<Show when={props.likeCount !== 0}>
					{props.likeCount.toLocaleString()}
				</Show>
			</div>
		</div>
	)
}

export default PostFooter
