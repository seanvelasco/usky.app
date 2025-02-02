import { A } from '@solidjs/router'
import { Show } from 'solid-js/web'
import type { ExternalEmbed as ExternalEmbedType } from '../../types'
import { createImageLink, did } from '../../utils'
import styles from './Embed.module.css'

const ExternalEmbed = (props: { external: ExternalEmbedType; did: string }) => {
	const baseUrl = new URL(props.external.uri)
	return (
		<div
			class={styles.embed}
			style={{
				'background-color': 'var(--background-secondary)'
			}}
		>
			<Show when={props?.external?.thumb}>
				{(image) => (
					<img
						loading='lazy'
						class={styles.image}
						src={createImageLink({
							image: image(),
							did: did(props.did ?? props.external.uri)
						})}
						alt={props.external.title}
					/>
				)}
			</Show>
			<div class={styles.text}>
				<Show when={props?.external?.uri}>
					<span class={styles.urlText}>
						{new URL(props.external.uri).hostname}
					</span>
				</Show>
				<Show when={props?.external?.title}>
					<A
						target='_blank'
						rel='nofollow'
						class={styles.title}
						href={props.external?.uri}
					>
						{props.external.title}
					</A>
				</Show>
				<Show when={props?.external?.description}>
					<p class={styles.description}>
						{props.external.description}
					</p>
				</Show>
			</div>
			<A
				aria-label={`External embed to ${
					props.external?.title ?? baseUrl.origin
				}`}
				href={props.external?.uri}
				target='_blank'
				class={styles.wrapper}
				rel='external noopener'
			/>
		</div>
	)
}

export default ExternalEmbed
