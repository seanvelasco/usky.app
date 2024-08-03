import { A } from '@solidjs/router'
import { ErrorBoundary, For, Show } from 'solid-js'
import type { Feed, Profile } from '../types'
import { id } from '../utils'
import Avatar from './Avatar'
import styles from './Section.module.css'
import entryStyles from './Entry.module.css'

export const ListItem = (props: {
	href: string
	avatar: string
	name: string
	handle?: string
}) => {
	return (
		<div class={styles.item}>
			<Avatar size='2.25rem' src={props.avatar} />
			<div>
				<A class={styles.name} href={props.href}>
					{props.name}
				</A>
				<Show when={props.handle}>
					<A class={entryStyles.handle} href={props.href}>
						@{props.handle}
					</A>
				</Show>

				{/* <A href={props.href}>{props.name}</A> */}
			</div>
			<A
				aria-label={props.name}
				class={styles.wrapper}
				href={props.href}
			></A>
		</div>
	)
}

const Section = (props: { title: string; list: Feed[] }) => {
	return (
		<section class={styles.section}>
			<p class={styles.title}>{props.title}</p>
			<For each={props.list}>
				{(list) => (
					<ListItem
						href={`/profile/${list.creator.did}/feed/${id(list.uri)}`}
						avatar={list?.avatar ?? '/feed.svg'}
						name={list.displayName}
					/>
				)}
			</For>
			<A class={`${styles.item} ${styles.more}`} href='/feeds'>
				More feeds
			</A>
		</section>
	)
}

export const TagsSection = (props: {
	tags: { hashtag: string; count: number }[]
}) => {
	return (
		<section class={styles.section}>
			<p class={styles.title}>Trends</p>
			<For each={props.tags}>
				{(list) => (
					<div class={styles.item}>
						<div>
							<A
								class={`${styles.name} ${styles.hashtag}`}
								href={`/hashtag/${list.hashtag}`}
							>
								#{list.hashtag}
							</A>
							<p class={styles.subtitle}>
								{list.count.toLocaleString()} posts
							</p>
						</div>
						<A
							aria-label={list.hashtag}
							class={styles.wrapper}
							href={`/hashtag/${list.hashtag}`}
						></A>
					</div>
				)}
			</For>
			<A class={`${styles.item} ${styles.more}`} href='/trends'>
				More trends
			</A>
		</section>
	)
}

export const ActorsSection = (props: {
	title: string
	actors: Pick<Profile, 'displayName' | 'handle' | 'avatar' | 'banner'>[]
}) => {
	return (
		<ErrorBoundary
			fallback={<p>{JSON.stringify(props.actors, null, 2)}</p>}
		>
			<section class={styles.section}>
				<p class={styles.title}>{props.title}</p>
				<For each={props.actors.filter((actor) => actor)}>
					{(actor) => (
						<ListItem
							href={`/profile/${actor.handle}`}
							avatar={actor.avatar ?? '/avatar.svg'}
							name={actor?.displayName || `@${actor.handle}`}
						/>
					)}
				</For>
			</section>
		</ErrorBoundary>
	)
}

export default Section
