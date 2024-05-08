import { For } from 'solid-js'
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
	const stats = [
		{
			label: 'replies',
			count: props.replyCount,
			icon: <RepliesIcon />
		},
		{
			label: 'repost',
			count: props.repostCount,
			icon: <RepostsIcon />
		},
		{
			label: 'likes',
			count: props.likeCount,
			icon: <LikesIcon />
		}
	]

	return (
		<div class={styles.footer} style={props.styles}>
			<For each={stats}>
				{(stat) => (
					<div class={styles.wrapper}>
						<button
							class={styles.button}
							aria-label={`${stat.count.toLocaleString()} ${stat.label}`}
						>
							{stat.icon}
						</button>
						<Show when={props.replyCount && props.replyCount !== 0}>
							{stat.count.toLocaleString()}
						</Show>
					</div>
				)}
			</For>
		</div>
	)
}

export default PostFooter
