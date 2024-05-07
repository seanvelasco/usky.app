import { For, Show } from 'solid-js'
import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { getPostsData } from '..'
import Post from '../../../../components/Post'

export const Replies = (props: RouteSectionProps) => {
	const posts = createAsync(() => getPostsData(props.params.profile))
	return (
		<For each={posts()?.feed}>
			{(post) => (
				<Show when={post?.reply && !post?.reason}>
					<Post {...post} />
				</Show>
			)}
		</For>
	)
}

export default Replies
