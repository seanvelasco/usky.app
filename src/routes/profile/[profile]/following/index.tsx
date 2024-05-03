import { cache, createAsync, RouteSectionProps } from '@solidjs/router'
import { For } from 'solid-js'
import getFollows from '../../../../api/graph/getFollows'
import Entry from '../../../../components/Entry'

export const getFollowsData = cache(
	async (profile: string) => await getFollows(profile),
	'profile_follows'
)

export const Following = (props: RouteSectionProps) => {
	const follows = createAsync(() => getFollowsData(props.params.profile))

	return (
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
	)
}

export default Following
