import { cache, createAsync, type RouteSectionProps } from '@solidjs/router'
import { ErrorBoundary, For, Suspense } from 'solid-js'
import getLists from '../../../../api/graph/getLists'
import resolveHandle from '../../../../api/identity/resolveHandle'
import Entry from '../../../../components/Entry'
import { id } from '../../../../utils'
import { Fallback } from '..'
import Spinner from '../../../../components/Spinner.tsx'

export const getListsData = cache(async (profile: string) => {
	const did = await resolveHandle(profile)
	return await getLists(did)
}, 'profile_lists')

export const Lists = (props: RouteSectionProps) => {
	const lists = createAsync(() => getListsData(props.params.profile))

	return (
		<ErrorBoundary fallback={<Fallback text='Unable to display lists' />}>
			<Suspense fallback={<Spinner />}>
				<For
					each={lists()?.lists}
					fallback={<Fallback text='No lists yet' />}
				>
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
			</Suspense>
		</ErrorBoundary>
	)
}

export default Lists
