import { cache, createAsync, RouteSectionProps } from '@solidjs/router'
import { For } from 'solid-js'
import getFollows from '../../../../api/graph/getFollows'
import Entry from '../../../../components/Entry'
import { getProfileData } from '..'
import { Link, Meta, Title } from '@solidjs/meta'

export const getFollowsData = cache(
	async (profile: string) => await getFollows(profile),
	'profile_follows'
)

export const Following = (props: RouteSectionProps) => {
	const follows = createAsync(() => getFollowsData(props.params.profile))
	const profile = createAsync(() => getProfileData(props.params.profile))

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
