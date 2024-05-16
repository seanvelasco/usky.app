import { cache, createAsync, type RouteSectionProps } from '@solidjs/router'
import { ErrorBoundary, For } from 'solid-js'
import getFollowers from '../../../../api/graph/getFollowers'
import Entry from '../../../../components/Entry'
import { Link, Meta, Title } from '@solidjs/meta'
import { getProfileData } from '..'

export const getFollowersData = cache(
	async (profile: string) => await getFollowers(profile),
	'profile_followers'
)

export const Followers = (props: RouteSectionProps) => {
	const followers = createAsync(() => getFollowersData(props.params.profile))
	const profile = createAsync(() => getProfileData(props.params.profile))

	const title = () =>
		`People following ${profile()?.displayName || profile()?.handle} (@${profile()?.handle}) - Bluesky (usky.app)`
	const url = () => `https://usky.app/profile/${profile()?.handle}/followers`

	return (
		<>
			<ErrorBoundary fallback={<Title>{title()}</Title>}>
				<Title>{title()}</Title>
				<Meta name='og:title' content={title()} />
				<Meta property='og:url' content={url()} />
				<Meta name='twitter:title' content={title()} />
				<Meta property='twitter:url' content={url()} />
				<Link rel='canonical' href={url()} />
			</ErrorBoundary>
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
