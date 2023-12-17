import { For, Show } from "solid-js"
import { useRouteData } from "@solidjs/router"
import Post from "../../../../components/Post"
import type { PostsData } from ".."

export const Replies = () => {
	const posts = useRouteData<typeof PostsData>()

	if (posts.error) {
		return <p>Unable to retrieve posts</p>
	}

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
