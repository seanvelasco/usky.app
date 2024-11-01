import { Show, For, ErrorBoundary } from 'solid-js'
import { A, createAsync } from '@solidjs/router'
import { Link, Meta, Title } from '@solidjs/meta'
import listConvos from '../../api/convo/listConvos'
import { useSession } from '../../states/session'
import Avatar from '../../components/Avatar'
import TimeAgo from '../../components/TimeAgo'
import styles from './styles.module.css'
import type { Convo } from '../../types'
import Fallback from '../../components/Fallback'

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
	const session = useSession()
	const title = () => 'Messages - Bluesky (usky.app)'
	const url = () => 'https://usky.app/messages'
	const convos = createAsync(() => listConvos({ session }))
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
				<div class={styles.xxx}>
					<Show when={convos()}>
						{(convos) => (
							<For each={convos().convos}>
								{(convo) => <MessagePreview convo={convo} />}
							</For>
						)}
					</Show>
				</div>
			</ErrorBoundary>
		</>
	)
}

export default Messages
