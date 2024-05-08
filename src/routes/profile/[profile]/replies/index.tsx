import { ErrorBoundary, For, Suspense } from 'solid-js'
import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { getPostsData } from '..'
import Post from '../../../../components/Post'
import { Fallback } from '..'
import Spinner from '../../../../components/Spinner.tsx'

export const Replies = (props: RouteSectionProps) => {
	const posts = createAsync(() => getPostsData(props.params.profile))
	return (
		<ErrorBoundary fallback={<Fallback text='Unable to display replies' />}>
			<Suspense fallback={<Spinner />}>
				<For
					each={posts()?.feed.filter(
						(post) => post?.reply && !post?.reason
					)}
					fallback={<Fallback text='No replies yet' />}
				>
					{(post) => <Post {...post} />}
				</For>
			</Suspense>
		</ErrorBoundary>
	)
}

export default Replies
