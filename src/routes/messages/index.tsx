import { Show, For } from 'solid-js'
import { A, createAsync } from '@solidjs/router'
import Avatar from '../../components/Avatar'
import TimeAgo from '../../components/TimeAgo.tsx'
import listConvos from '../../api/convo/listConvos'
import styles from './styles.module.css'
import entryStyles from '../../components/Entry.module.css'
import type { Convo } from '../../types'

const MessagePreview = (props: { convo: Convo }) => (
	<A class={styles.message} href={`/messages/${props.convo.id}`}>
		<Avatar src={props.convo.members[0].avatar} />
		<div class={styles.mid}>
			<p class={entryStyles.name}>{props.convo.members[0].displayName}</p>
			<p class={entryStyles.handle}>@{props.convo.members[0].handle}</p>
			<p style={{ padding: 0 }} class={entryStyles.description}>
				{props.convo.lastMessage.text}
			</p>
		</div>
		<TimeAgo time={new Date(props.convo.lastMessage.sentAt)} />
	</A>
)

const Messages = () => {
	const convos = createAsync(() => listConvos())
	return (
		<Show when={convos()}>
			{(convos) => (
				<For each={convos().convos}>
					{(convo) => <MessagePreview convo={convo} />}
				</For>
			)}
		</Show>
	)
}

export default Messages
