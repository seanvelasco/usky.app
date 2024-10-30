import getMessages from '../../../api/convo/getMessages'
import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { For, Suspense, Show } from 'solid-js'
import type { Message } from '../../../types'
import styles from './styles.module.css'
import { useSession } from '../../../states/session'
import Spinner from '../../../components/Spinner'

const isIdenticalDate = (date1: Date | undefined, date2: Date | undefined) => {
	if (date1 && date2) {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		)
	}
}

const Timestamp = (props: { date: Date }) => (
	<time
		style={{
			color: 'var(--text-secondary)',
			'text-align': 'center',
			'font-size': '0.75rem'
		}}
	>
		<Show
			when={!isIdenticalDate(props.date, new Date())}
			fallback={'Today'}
		>
			{props.date.toLocaleDateString('en-us', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})}
		</Show>
	</time>
)

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
		<Suspense fallback={<Spinner />}>
			<div class={styles.history}>
				<Show when={messages()?.messages}>
					{(messages) => (
						<For each={messages()}>
							{(message, index) => {
								const current = new Date(message.sentAt)
								const prev =
									index() > 0
										? new Date(messages()[0].sentAt)
										: undefined
								return (
									<>
										<Bubble
											message={message}
											self={
												message.sender.did ===
												session.did
											}
										/>
										<Show
											when={
												!isIdenticalDate(current, prev)
											}
										>
											<Timestamp date={current} />
										</Show>
									</>
								)
							}}
						</For>
					)}
				</Show>
			</div>
		</Suspense>
	)
}

export default Message
