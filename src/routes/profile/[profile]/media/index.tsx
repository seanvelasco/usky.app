import { useRouteData } from "@solidjs/router";
import { For, Show } from "solid-js";
import type { PostsData } from "..";
import carouselStyles from "../../../../components/MediaCarousel.module.css";

export const Media = () => {
	const posts = useRouteData<typeof PostsData>();

	if (posts.error) {
		return <p>Unable to retrieve media</p>;
	}

	return (
		<div class={carouselStyles.carousel}>
			<For each={posts()?.feed}>
				{(post) => (
					<Show
						when={
							post?.post?.embed?.$type === "app.bsky.embed.images#view" &&
							post?.post?.embed?.images
						}
					>
						{(images) => (
							<For each={images()}>
								{(image) => <img src={image?.thumb} alt={image.alt} />}
							</For>
						)}
					</Show>
				)}
			</For>
		</div>
	);
};

export default Media;
