import commonStyles from "./Embed.module.css"
import Avatar from "../Avatar"
import { A } from "@solidjs/router"
import type { PostEmbed as PostEmbedType } from "../../types"
import TimeAgo from "../TimeAgo"
import { Show, For, Switch, Match } from "solid-js"
import Embed from "./Embed"
import postStyles from "../Post.module.css"
import LazyLoadEmbed from "./LazyLoadEmbed"
import { id } from "../../utils"

const PostEmbed = (props: PostEmbedType) => {
	return (
		<Switch>
			<Match when={props?.author}>
				<article class={`${commonStyles.embed} ${commonStyles.record}`}>
					<div class={postStyles.authorembed}>
						<Avatar
							size="1.75rem"
							src={props.author?.avatar ?? "/avatar.svg"}
							alt={`${
								props.author?.displayName ??
								`@${props.author?.handle}`
							} avatar`}
						/>
						<div class={postStyles.header}>
							<A
								rel="author"
								class={postStyles.name}
								href={`/profile/${props.author?.handle}`}
							>
								{props.author?.displayName ??
									props.author?.handle}
							</A>{" "}
							<A
								rel="author"
								class={postStyles.handle}
								href={`/profile/${props.author?.handle}`}
							>
								@{props?.author?.handle}
							</A>{" "}
							<TimeAgo time={new Date(props.value?.createdAt)} />
						</div>
					</div>
					<div class={postStyles.content}>
						<Show when={props?.value?.text}>
							<p class={postStyles.text}>{props.value.text}</p>
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
						class={postStyles.wrapper}
						href={`/profile/${props.author?.handle}/post/${id(
							props?.uri
						)}`}
					></A>
				</article>
			</Match>
			<Match when={props?.uri}>
				<LazyLoadEmbed {...props} />
			</Match>
		</Switch>
	)
}

export default PostEmbed
