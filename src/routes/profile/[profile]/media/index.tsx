import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { getPostsData } from '..'
import MediaCarousel from '../../../../components/MediaCarousel'
import { ErrorBoundary, Show, Suspense } from 'solid-js'
import { Fallback } from '..'
import Spinner from '../../../../components/Spinner.tsx'

export const Media = (props: RouteSectionProps) => {
	const thread = createAsync(() => getPostsData(props.params.profile))
	const posts = () =>
		thread()
			?.feed.filter((thread) => !thread.reason)
			.map((thread) => thread.post)
	return <ErrorBoundary fallback={<Fallback text="Unable to display media" />}>
		<Suspense fallback={<Spinner />}>
			<Show when={posts()?.length} fallback={<Fallback text="No media yet" />}>
				<MediaCarousel posts={posts()} />
			</Show>
		</Suspense>
	</ErrorBoundary>
}

export default Media
