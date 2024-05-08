import { A } from '@solidjs/router'
import { For, Match, Show, Switch, lazy } from 'solid-js'
import type { PostEmbed as PostEmbedType } from '../../types'
import { id } from '../../utils'
import Avatar from '../Avatar'
import postStyles from '../Post.module.css'
import TimeAgo from '../TimeAgo'
import Embed from './Embed'
import commonStyles from './Embed.module.css'
import LazyLoadEmbed from './LazyLoadEmbed'
const RichText = lazy(() => import('../RichText'))

const PostEmbed = (props: PostEmbedType) => {
	return (
		<Switch>
			<Match when={props?.author}>
				<article class={`${commonStyles.embed} ${commonStyles.record}`}>
					<div class={postStyles.authorembed}>
						<A
							rel='author'
							href={`/profile/${props.author?.handle}`}
							class={postStyles.avatar}
						>
							<Avatar
								size='1.75rem'
								src={props.author?.avatar ?? '/avatar.svg'}
								alt={`${
									props.author?.displayName ??
									`@${props.author?.handle}`
								} avatar`}
							/>
						</A>
						<div class={postStyles.header}>
							<A
								rel='author'
								class={postStyles.name}
								href={`/profile/${props.author?.handle}`}
							>
								{props.author?.displayName ??
									props.author?.handle}
							</A>{' '}
							<A
								rel='author'
								class={postStyles.handle}
								href={`/profile/${props.author?.handle}`}
							>
								@{props?.author?.handle}
							</A>{' '}
							<TimeAgo time={new Date(props.value?.createdAt)} />
						</div>
					</div>
					<div class={postStyles.content}>
						<Show when={props?.value?.text}>
							<p class={postStyles.text}>
								<RichText
									text={props.value.text}
									facets={props.value.facets}
								/>
							</p>
						</Show>
						<Show when={props?.embeds}>
							<For each={props.embeds}>
								{(embed) => (
									<Embed
										embed={embed}
										did={props.author?.did}
									/>
								)}
							</For>
						</Show>
						<Show
							when={
								props?.embeds === undefined &&
								props?.value?.embed
							}
						>
							{(embed) => (
								<Embed
									embed={embed()}
									did={props.author?.did}
								/>
							)}
						</Show>
					</div>
					<A
						aria-label='Post embed'
						class={postStyles.wrapper}
						href={`/profile/${props.author?.handle}/post/${id(props?.uri)}`}
					/>
				</article>
			</Match>
			<Match when={props?.uri}>
				<LazyLoadEmbed {...props} />
			</Match>
		</Switch>
	)
}

export default PostEmbed
