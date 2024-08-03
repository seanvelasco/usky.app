import { A } from '@solidjs/router'
import { Show, lazy } from 'solid-js'
import Avatar from './Avatar'
import styles from './Entry.module.css'

const RichText = lazy(() => import('./RichText'))

const Entry = (props: {
	displayName: string
	handle?: string
	description?: string
	avatar: string
	href: string
	type?: 'creator'
	mini?: boolean
}) => {
	console.log(props.mini)
	return (
		<div class={`${styles.entry} ${props.mini && styles.mini}`}>
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
					{(description) => (
						<p class={styles.description}>
							<RichText text={description()} />
						</p>
					)}
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
