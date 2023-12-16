import Avatar from "./Avatar"
import { For } from "solid-js"
import { A } from "@solidjs/router"
import styles from "./Section.module.css"
import type { Profile, Feed } from "../types"
import { id } from "../utils"

const SectionItem = (props: {
	href: string
	avatar: string
	name: string
	handle?: string
}) => {
	return (
		<div class={styles.item}>
			<Avatar size="2.25rem" src={props.avatar} />
			<div>
				<A class={styles.name} href={props.href}>
					{props.name}
				</A>
				{/* <A href={props.href}>{props.handle}</A> */}
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
					<SectionItem
						href={`/profile/${list.creator.did}/feed/${id(
							list.uri
						)}`}
						avatar={list?.avatar ?? "/feed.svg"}
						name={list.displayName}
					/>
				)}
			</For>
		</section>
	)
}

export const ActorsSection = (props: {
	title: string
	actors: Pick<Profile, "displayName" | "handle" | "avatar" | "banner">[]
}) => {
	return (
		<section class={styles.section}>
			<p class={styles.title}>{props.title}</p>
			<For each={props.actors}>
				{(actor) => (
					<SectionItem
						href={`/profile/${actor.handle}`}
						avatar={actor.avatar ?? "/avatar.svg"}
						name={actor?.displayName ?? actor.handle}
					/>
				)}
			</For>
		</section>
	)
}

export default Section
