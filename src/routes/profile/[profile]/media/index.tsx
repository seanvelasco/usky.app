import { createAsync, type RouteSectionProps } from '@solidjs/router'
import { For, Show } from 'solid-js'
import { getPostsData } from '..'
import carouselStyles from '../../../../components/MediaCarousel.module.css'

export const Media = (props: RouteSectionProps) => {
	const posts = createAsync(() => getPostsData(props.params.profile))

	return (
		<div class={carouselStyles.carousel}>
			<For each={posts()?.feed}>
				{(post) => (
					<Show
						when={
							post?.post?.embed?.$type ===
								'app.bsky.embed.images#view' &&
							post?.post?.embed?.images
						}
					>
						{(images) => (
							<For each={images()}>
								{(image) => (
									<img src={image?.thumb} alt={image.alt} />
								)}
							</For>
						)}
					</Show>
				)}
			</For>
		</div>
	)
}

export default Media
