import { Show } from 'solid-js/web'
import { LikesIcon } from '../assets/likes'
import { RepliesIcon } from '../assets/replies'
import { RepostsIcon } from '../assets/reposts'
import styles from './PostFooter.module.css'

import type { JSX } from 'solid-js'

const PostFooter = (props: {
	replyCount: number
	repostCount: number
	likeCount: number
	styles?: JSX.CSSProperties
}) => {
	return (
		<div class={styles.footer} style={props.styles}>
			<div class={styles.wrapper}>
				<Show when={props.replyCount && props.replyCount !== 0}>
					<button
						class={styles.button}
						aria-label={`${props.replyCount?.toLocaleString()} replies`}
					>
						<RepliesIcon />
					</button>
					{props.replyCount.toLocaleString()}
				</Show>
			</div>
			<div class={styles.wrapper}>
				<Show when={props.repostCount && props.repostCount !== 0}>
					<button
						class={styles.button}
						aria-label={`${props.repostCount.toLocaleString()} reposts`}
					>
						<RepostsIcon />
					</button>
					{props.repostCount.toLocaleString()}
				</Show>
			</div>
			<div class={styles.wrapper}>
				<Show when={props.likeCount && props.likeCount !== 0}>
					<button
						class={styles.button}
						aria-label={`${props.likeCount.toLocaleString()} likes`}
					>
						<LikesIcon />
					</button>
					{props.likeCount.toLocaleString()}
				</Show>
			</div>
		</div>
	)
}

export default PostFooter
