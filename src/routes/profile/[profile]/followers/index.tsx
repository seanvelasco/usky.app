import { For } from 'solid-js'
import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { Link, Meta, Title } from '@solidjs/meta'
import getFollowers from '../../../../api/graph/getFollowers'
import getProfile from '../../../../api/actor/getProfile'
import Entry from '../../../../components/Entry'

export const Followers = (props: RouteSectionProps) => {
	const followers = createAsync(() => getFollowers(props.params.profile))
	const profile = createAsync(() => getProfile(props.params.profile))

	const title = () =>
		`People following ${profile()?.displayName || profile()?.handle} (@${profile()?.handle}) - Bluesky (usky.app)`
	const url = () => `https://usky.app/profile/${profile()?.handle}/followers`

	return (
		<>
			<Title>{title()}</Title>
			<Meta name='og:title' content={title()} />
			<Meta property='og:url' content={url()} />
			<Meta name='twitter:title' content={title()} />
			<Meta property='twitter:url' content={url()} />
			<Link rel='canonical' href={url()} />
			<For each={followers()?.followers}>
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

export default Followers
