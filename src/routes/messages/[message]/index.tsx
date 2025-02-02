import { For, Show, createSignal, createEffect, ErrorBoundary } from 'solid-js'
import {
	createAsync,
	action,
	// useSubmission,
	type RouteSectionProps
} from '@solidjs/router'
import { Link, Meta, Title } from '@solidjs/meta'
// import getConvo from '../../../api/convo/getConvo'
import getMessages from '../../../api/convo/getMessages'
import sendMessage from '../../../api/convo/sendMessage'
import Fallback from '../../../components/Fallback'
import { useSession } from '../../../states/session'
import styles from './styles.module.css'
import type { Message } from '../../../types'

const isIdenticalDate = (date1: Date, date2: Date) => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	)
}

const Timestamp = (props: { date: Date }) => (
	<time
		style={{
			color: 'var(--text-secondary)',
			'text-align': 'center',
			'font-size': '0.75rem'
		}}
	>
		{props.date.toLocaleTimeString([], {
			hour: 'numeric',
			minute: 'numeric'
		})}
	</time>
)

const Datestamp = (props: { date: Date }) => (
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
		<Timestamp date={new Date(props.message.sentAt)} />
	</div>
)

const Message = (props: RouteSectionProps) => {
	let history: HTMLDivElement | undefined
	const session = useSession()

	const title = () => `Chat - Bluesky (usky.app)`
	const url = () => `https://usky.app/messages/${props.params.message}`

	// const convo = createAsync(() =>
	// 	getConvo({ session, id: props.params.message })
	// )

	const messages = createAsync(() =>
		getMessages({ session, id: props.params.message })
	)
	const [input, setInput] = createSignal('')

	createEffect(() => {
		if (messages()) {
			if (history) {
				history.scrollTo({
					top: history.scrollHeight
				})
			}
		}
	})

	const authenticate = action(async () => {
		try {
			const message = sendMessage({
				session,
				id: props.params.message,
				message: input()
			})
			setInput('')
			if (await message) {
				return new Response(undefined, { status: 200 })
			}
		} catch (error) {
			console.log('error', error)
		}
		return new Error('Invalid login')
	})

	// const submission = useSubmission(authenticate)

	return (
		<>
			<Title>{title()}</Title>
			<Meta property='og:title' content={title()} />
			<Meta property='og:url' content={url()} />
			<Meta name='twitter:title' content={title()} />
			<Meta property='twitter:url' content={url()} />
			<Link rel='canonical' href={url()} />
			<ErrorBoundary
				fallback={(err, reset) => <Fallback err={err} reset={reset} />}
			>
				<div class={styles.page}>
					<div ref={history!} class={styles.history}>
						<Show when={messages()?.messages}>
							{(messages) => (
								<For each={messages()}>
									{(message, index) => {
										const current = message.sentAt
										const prev =
											index() !== 0 &&
											messages()[index() - 1].sentAt
										return (
											<>
												<Show
													when={
														!prev ||
														new Date(
															prev
														).toDateString() !==
															new Date(
																message.sentAt
															).toDateString()
													}
												>
													<Datestamp
														date={new Date(current)}
													/>
												</Show>
												<Bubble
													message={message}
													self={
														message.sender.did ===
														session.did
													}
												/>
											</>
										)
									}}
								</For>
							)}
						</Show>
					</div>
					<form
						action={authenticate}
						method='post'
						class={styles.form}
					>
						<input
							class={styles.input}
							type='text'
							name='message'
							placeholder='Send a message'
							value={input()}
							disabled={false}
							onInput={(event) => setInput(event.target.value)}
						/>
					</form>
				</div>
			</ErrorBoundary>
		</>
	)
}

export default Message
