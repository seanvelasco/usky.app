import { cache, createAsync, type RouteSectionProps } from '@solidjs/router'
import { For } from 'solid-js'
import getFollowers from '../../../../api/graph/getFollowers'
import Entry from '../../../../components/Entry'

export const getFollowersData = cache(
	async (profile: string) => await getFollowers(profile),
	'profile_followers'
)

export const Followers = (props: RouteSectionProps) => {
	const followers = createAsync(() => getFollowersData(props.params.profile))

	return (
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
	)
}

export default Followers
