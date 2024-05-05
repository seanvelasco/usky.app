import { cache, createAsync, type RouteSectionProps } from '@solidjs/router'
import { For } from 'solid-js'
import getLists from '../../../../api/graph/getLists'
import resolveHandle from '../../../../api/identity/resolveHandle'
import Entry from '../../../../components/Entry'
import { id } from '../../../../utils'

export const getListsData = cache(async (profile: string) => {
	const did = await resolveHandle(profile)
	return await getLists(did)
}, 'profile_lists')

export const Lists = (props: RouteSectionProps) => {
	const lists = createAsync(() => getListsData(props.params.profile))

	return (
		<For each={lists()?.lists}>
			{(list) => (
				<Entry
					type='creator'
					displayName={list.name}
					description={list.description}
					avatar='/avatar_group.svg'
					href={`/profile/${list.creator.handle}/lists/${id(list.uri)}`}
				/>
			)}
		</For>
	)
}

export default Lists
