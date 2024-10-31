import { Show, For } from 'solid-js'
import { A, createAsync } from '@solidjs/router'
import { Link, Meta, Title } from '@solidjs/meta'
import Avatar from '../../components/Avatar'
import listConvos from '../../api/convo/listConvos'
import TimeAgo from '../../components/TimeAgo'
import styles from './styles.module.css'
import type { Convo } from '../../types'

const MessagePreview = (props: { convo: Convo }) => (
	<A class={styles.message} href={`/messages/${props.convo.id}`}>
		<Avatar src={props.convo.members[0].avatar} />
		<div class={styles.mid}>
			<p class={styles.name}>{props.convo.members[0].displayName}</p>
			<p class={styles.handle}>@{props.convo.members[0].handle}</p>
			<p class={styles.text}>{props.convo.lastMessage.text}</p>
		</div>
		<TimeAgo
			style={{
				'font-size': '0.75rem'
			}}
			time={new Date(props.convo.lastMessage.sentAt)}
		/>
	</A>
)

const Messages = () => {
	const title = () => 'Messages - Bluesky (usky.app)'
	const url = () => 'https://usky.app/messages'
	const convos = createAsync(() => listConvos())
	return (
		<>
			<Title>{title()}</Title>
			<Meta property='og:title' content={title()} />
			<Meta property='og:url' content={url()} />
			<Meta name='twitter:title' content={title()} />
			<Meta property='twitter:url' content={url()} />
			<Link rel='canonical' href={url()} />
			<div class={styles.xxx}>
				<Show when={convos()}>
					{(convos) => (
						<For each={convos().convos}>
							{(convo) => <MessagePreview convo={convo} />}
						</For>
					)}
				</Show>
			</div>
		</>
	)
}

export default Messages
