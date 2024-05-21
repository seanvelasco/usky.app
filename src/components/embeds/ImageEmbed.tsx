import type { ImageEmbed as ImageEmbedType } from '../../types'
import { createImageLink } from '../../utils'

import { For } from 'solid-js/web'

import styles from './ImageEmbed.module.css'

const ImageEmbed = (props: { images: ImageEmbedType[]; did?: string }) => {
	return (
		<div class={styles.wrapper}>
			<For each={props.images}>
				{(image) => {
					return (
						<div class={styles.image}>
							<img
								style={{
									'aspect-ratio': image?.aspectRatio
										? image.aspectRatio.width /
											image.aspectRatio.height
										: 1
								}}
								src={
									image?.thumb?.replace('jpeg', 'webp') ||
									createImageLink({
										image: image?.image,
										did: props?.did
									})
								}
								alt={image.alt}
							/>
						</div>
					)
				}}
			</For>
		</div>
	)
}

export default ImageEmbed
