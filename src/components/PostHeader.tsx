import { A } from '@solidjs/router'
import styles from './PostHeader.module.css'
import type { Actor } from '../types'

const PostHeader = (props: { actor: Actor }) => (
	<div class={styles.repost}>
		<svg
			class={styles.icon}
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			stroke-width='1.5'
			stroke='currentColor'
		>
			<path
				stroke-linecap='round'
				stroke-linejoin='round'
				d='M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3'
			/>
		</svg>
		<p class={styles.text}>
			<A class={styles.actor} href={`/profile/${props.actor.handle}`}>
				{props.actor.displayName ?? `@${props.actor.handle}`}
			</A>{' '}
			reposted
		</p>
	</div>
)

export default PostHeader
