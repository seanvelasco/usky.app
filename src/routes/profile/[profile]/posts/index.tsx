import { For, Show, ErrorBoundary } from 'solid-js'
import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { Link, Meta, Title } from '@solidjs/meta'
import Post from '../../../../components/Post'
import getAuthorFeed from '../../../../api/feed/getAuthorFeed'
import getProfile from '../../../../api/actor/getProfile'
import Fallback from '../../../../components/ListFallback'

const Posts = (props: RouteSectionProps) => {
	const posts = createAsync(() => getAuthorFeed(props.params.profile))
	const profile = createAsync(() => getProfile(props.params.profile))

	const title = () =>
		`${profile()?.displayName || profile()?.handle} (@${profile()?.handle}) - Bluesky (usky.app)`
	const url = () => `https://usky.app/profile/${profile()?.handle}`

	return (
		<>
			<Title>{title()}</Title>
			<Meta name='og:title' content={title()} />
			<Meta property='og:url' content={url()} />
			<Meta name='twitter:title' content={title()} />
			<Meta property='twitter:url' content={url()} />
			<Link rel='canonical' href={url()} />
			<ErrorBoundary
				fallback={<Fallback text='Unable to display posts' />}
			>
				<For each={posts()?.feed} fallback={<Fallback />}>
					{(post) => (
						<Show when={!post?.reply}>
							<Post {...post} />
						</Show>
					)}
				</For>
			</ErrorBoundary>
		</>
	)
}

export default Posts
