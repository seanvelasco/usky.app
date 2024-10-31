import { For, Suspense, Show, createSignal, createEffect } from 'solid-js'
import {
	createAsync,
	action,
	cache,
	// useSubmission,
	type RouteSectionProps
} from '@solidjs/router'
import { Link, Meta, Title } from '@solidjs/meta'
import getConvo from '../../../api/convo/getConvo'
import getMessages from '../../../api/convo/getMessages'
import sendMessage from '../../../api/convo/sendMessage'
import type { Message } from '../../../types'
import styles from './styles.module.css'
import { useSession } from '../../../states/session'
import Spinner from '../../../components/Spinner'

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

const getMessagesData = cache(
	async (id: string) => await getMessages({ id }),
	'get_messages'
)

const Message = (props: RouteSectionProps) => {
	let history: HTMLDivElement
	const session = useSession()
	const convo = createAsync(() => getConvo({ id: props.params.message }))
	const messages = createAsync(() => getMessagesData(props.params.message))
	const [input, setInput] = createSignal('')

	createEffect(() => {
		if (messages()) {
			history.scrollTo({
				top: history.scrollHeight
			})
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
			console.log('ewwow', error)
		}
		return new Error('Invalid login')
	})

	// const submission = useSubmission(authenticate)

	const title = () => `Chat - Bluesky (usky.app)`
	const description = () => `Chat with - Bluesky (usky.app)`
	const url = () => `https://usky.app/messages/${convo()?.id}`

	return (
		<div class={styles.page}>
			<Suspense>
				<Title>{title()}</Title>
				<Meta property='og:title' content={title()} />
				<Meta property='og:description' content={description()} />
				<Meta property='og:url' content={url()} />
				<Meta name='twitter:title' content={title()} />
				<Meta name='twitter:description' content={description()} />
				<Meta property='twitter:url' content={url()} />
				<Link rel='canonical' href={url()} />
			</Suspense>
			<Suspense fallback={<Spinner />}>
				<div ref={history!} class={styles.history}>
					<Show when={messages()?.messages}>
						{(messages) => (
							<For each={messages().reverse()}>
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
				<form action={authenticate} method='post' class={styles.form}>
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
			</Suspense>
		</div>
	)
}

export default Message
