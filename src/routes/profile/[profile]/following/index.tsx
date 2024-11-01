import { For } from 'solid-js'
import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { Link, Meta, Title } from '@solidjs/meta'
import getFollows from '../../../../api/graph/getFollows'
import getProfile from '../../../../api/actor/getProfile.ts'
import Entry from '../../../../components/Entry'

export const Following = (props: RouteSectionProps) => {
	const follows = createAsync(() => getFollows(props.params.profile))
	const profile = createAsync(() => getProfile(props.params.profile))

	const title = () =>
		`People followed by ${profile()?.displayName || profile()?.handle} (@${profile()?.handle}) - Bluesky (usky.app)`
	const url = () => `https://usky.app/profile/${profile()?.handle}/following`

	return (
		<>
			<Title>{title()}</Title>
			<Meta name='og:title' content={title()} />
			<Meta property='og:url' content={url()} />
			<Meta name='twitter:title' content={title()} />
			<Meta property='twitter:url' content={url()} />
			<Link rel='canonical' href={url()} />
			<For each={follows()?.follows}>
				{(actor) => (
					<Entry
						displayName={actor?.displayName ?? actor.handle}
						handle={actor?.handle}
						description={actor?.description}
						avatar={actor.avatar ?? '/avatar.svg'}
						href={`/profile/${actor.handle}`}
					/>
				)}
			</For>
		</>
	)
}

export default Following
