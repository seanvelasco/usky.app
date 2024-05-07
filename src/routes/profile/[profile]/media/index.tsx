import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { getPostsData } from '..'
import MediaCarousel from '../../../../components/MediaCarousel.tsx'

export const Media = (props: RouteSectionProps) => {
	const thread = createAsync(() => getPostsData(props.params.profile))
	const posts = () =>
		thread()
			?.feed.filter((thread) => !thread.reason)
			.map((thread) => thread.post)
	return <MediaCarousel posts={posts()} />
}

export default Media
