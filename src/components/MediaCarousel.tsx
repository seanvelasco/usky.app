import { For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { id } from '../utils'
import styles from './MediaCarousel.module.css'
import type { FeedPost } from '../types'

const MediaCarousel = (props: { posts: FeedPost[] | undefined }) => {
	const posts = () =>
		props.posts?.filter(
			(post) =>
				post.embed?.$type === 'app.bsky.embed.images#view' &&
				post?.embed?.images
		)
	return (
		<Show when={Boolean(posts()?.length) && posts()}>
			{(posts) => (
				<div class={styles.carousel}>
					<For each={posts()}>
						{(post) => (
							<Show
								when={
									post.embed?.$type ===
										'app.bsky.embed.images#view' &&
									post.embed?.images
								}
							>
								{(images) => (
									<For each={images()}>
										{(image) => (
											<A
												href={`https://usky.app/profile/${post.author.handle}/post/${id(post.uri)}`}
											>
												<img
													src={image.thumb}
													alt={image.alt}
												/>
											</A>
										)}
									</For>
								)}
							</Show>
						)}
					</For>
				</div>
			)}
		</Show>
	)
}

export default MediaCarousel
