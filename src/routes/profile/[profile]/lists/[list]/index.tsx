import { For, Suspense } from 'solid-js'
import { createAsync, cache, type RouteSectionProps } from '@solidjs/router'
import Avatar from '../../../../../components/Avatar'
import Post from '../../../../../components/Post'
import { Link, Meta, Title } from '@solidjs/meta'
import Spinner from '../../../../../components/Spinner'
import getList from '../../../../../api/graph/getList'
import getListFeed from '../../../../../api/feed/getListFeed'
import resolveHandle from '../../../../../api/identity/resolveHandle'
import styles from '../../../[profile]/feed/[feed]/styles.module.css'

export const getListData = cache(
	async ({ profile, list }: { profile: string; list: string }) => {
		const did = await resolveHandle(profile)

		const uri = `at://${did}/app.bsky.graph.list/${list}`

		const listData = await getList(uri)

		const listFeedData = await getListFeed(uri)

		return {
			list: listData.list,
			feed: listFeedData.feed
		}
	},
	'profile_list'
)

const List = (props: RouteSectionProps) => {
	const list = createAsync(() =>
		getListData({ profile: props.params.profile, list: props.params.list })
	)

	const title = () => `${list()?.list.name} - Bluesky (usky.app)`
	const description = () => list()?.list.description
	const url = () =>
		`https://usky.app/profile/${props.params.profile}/lists/${props.params.list}`
	const avatar = '/avatar_group.svg'

	return (
		<Suspense>
			<Title>{title()}</Title>
			<Meta name='description' content={description()} />
			<Meta property='og:title' content={title()} />
			<Meta property='og:description' content={description()} />
			<Meta property='og:url' content={url()} />
			<Meta property='og:image' content={avatar} />
			<Meta name='twitter:title' content={title()} />
			<Meta name='twitter:description' content={description()} />
			<Meta property='twitter:url' content={url()} />
			<Meta name='twitter:image' content={avatar} />
			<Link rel='canonical' href={url()} />
			<div class={styles.card}>
				<Avatar
					size='3.5rem'
					style={{
						'border-radius': '12px'
					}}
					src={'/avatar_group.svg'}
				/>
				<div class={styles.text}>
					<h3>{list()?.list.name}</h3>
					<p>{list()?.list.description}</p>
				</div>
			</div>
			<For each={list()?.feed} fallback={<Spinner />}>
				{(post) => <Post {...post} />}
			</For>
		</Suspense>
	)
}

export default List
