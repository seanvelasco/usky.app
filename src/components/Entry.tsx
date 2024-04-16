import { A } from '@solidjs/router'
import { Show } from 'solid-js'
import Avatar from './Avatar'
import styles from './Entry.module.css'

const Entry = (props: {
	displayName: string
	handle?: string
	description?: string
	avatar: string
	href: string
	type?: 'creator'
}) => {
	return (
		<div class={styles.entry}>
			<Avatar
				style={{
					'border-radius': props.type === 'creator' ? '12px' : '50%'
				}}
				src={props.avatar}
				alt={props.displayName}
			/>
			<div>
				<A class={styles.name} href={props.href}>
					{props.displayName}
				</A>{' '}
				<Show when={props.handle}>
					<A class={styles.handle} href={props.href}>
						@{props.handle}
					</A>{' '}
				</Show>
				<Show when={props.description}>
					<p class={styles.description}>{props.description}</p>
				</Show>
			</div>
			<A
				aria-label={props?.displayName ?? props.handle}
				class={styles.wrapper}
				href={props.href}
			/>
		</div>
	)
}

export default Entry
