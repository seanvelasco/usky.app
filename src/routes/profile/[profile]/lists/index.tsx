import { cache, createAsync, type RouteSectionProps } from '@solidjs/router'
import { ErrorBoundary, For, Suspense } from 'solid-js'
import getLists from '../../../../api/graph/getLists'
import resolveHandle from '../../../../api/identity/resolveHandle'
import Entry from '../../../../components/Entry'
import { id } from '../../../../utils'
import { Fallback, getProfileData } from '..'
import Spinner from '../../../../components/Spinner'
import { Link, Meta, Title } from '@solidjs/meta'

export const getListsData = cache(async (profile: string) => {
	const did = await resolveHandle(profile)
	return await getLists(did)
}, 'profile_lists')

export const Lists = (props: RouteSectionProps) => {
	const lists = createAsync(() => getListsData(props.params.profile))
	const profile = createAsync(() => getProfileData(props.params.profile))

	const title = () =>
		`Lists by ${profile()?.displayName || profile()?.handle} (@${profile()?.handle}) - Bluesky (usky.app)`
	const url = () => `https://usky.app/profile/${profile()?.handle}/lists`

	return (
		<ErrorBoundary fallback={<Fallback text='Unable to display lists' />}>
			<ErrorBoundary fallback={<Title>{title()}</Title>}>
				<Title>{title()}</Title>
				<Meta name='og:title' content={title()} />
				<Meta property='og:url' content={url()} />
				<Meta name='twitter:title' content={title()} />
				<Meta property='twitter:url' content={url()} />
				<Link rel='canonical' href={url()} />
			</ErrorBoundary>
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
