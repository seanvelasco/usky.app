import { ErrorBoundary, For, Show, Suspense } from 'solid-js'
import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { getPostsData } from '..'
import Post from '../../../../components/Post'
import { Fallback } from '..'
import Spinner from '../../../../components/Spinner.tsx'

export const Replies = (props: RouteSectionProps) => {
	const posts = createAsync(() => getPostsData(props.params.profile))
	return (
		<ErrorBoundary fallback={<Fallback text="Unable to display replies" />}>
			<Suspense fallback={<Spinner />}>
				<For each={posts()?.feed} fallback={<Fallback text="No replies yet" />}>
					{(post) => (
						<Show when={post?.reply && !post?.reason}>
							<Post {...post} />
						</Show>
					)}
				</For>
			</Suspense>
		</ErrorBoundary>
	)
}

export default Replies
