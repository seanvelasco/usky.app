import getMessages from '../../../api/convo/getMessages'
import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { For, Suspense } from 'solid-js'
import type { Message } from '../../../types'
import styles from './styles.module.css'
import { useSession } from '../../../states/session'

const Bubble = (props: { message: Message; self: boolean }) => (
	<div
		style={{
			'align-items': props.self ? 'flex-end' : 'flex-start'
		}}
		class={styles.container}
	>
		<div
			class={styles.bubble}
			style={{
				'border-radius': props.self
					? '17px 17px 2px'
					: '17px 17px 17px 2px'
			}}
		>
			<p>{props.message.text}</p>
		</div>
		<time>{props.message.sentAt}</time>
	</div>
)

const Message = (props: RouteSectionProps) => {
	const session = useSession()
	const messages = createAsync(() =>
		getMessages({ id: props.params.message })
	)
	return (
		<Suspense>
			<div class={styles.history}>
				<For each={messages()?.messages}>
					{(message) => (
						<Bubble
							message={message}
							self={message.sender.did === session.did}
						/>
					)}
				</For>
			</div>
		</Suspense>
	)
}

export default Message
