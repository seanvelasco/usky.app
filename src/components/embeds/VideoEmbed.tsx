import { createSignal, createEffect } from 'solid-js'
import HLS from 'hls.js'
import styles from './VideoEmbed.module.css'
import { VideoEmbedView } from '../../types'

const VideoEmbed = (props: VideoEmbedView) => {
	const player = new HLS({ debug: false })
	const [loaded, setLoaded] = createSignal(false)
	const [video, setVideo] = createSignal<HTMLVideoElement>()

	createEffect(() => {
		if (HLS.isSupported() && video()) {
			player.loadSource(props.playlist)
			player.attachMedia(video()!)
		}
	})

	return (
		<video
			ref={setVideo}
			class={styles.video}
			poster={props.thumbnail}
			width={props.aspectRatio.width}
			height={props.aspectRatio.height}
			style={{
				'aspect-ratio':
					props.aspectRatio.width / props.aspectRatio.height
			}}
			controls={loaded()}
			autoplay={true}
			loop={true}
			muted={true}
			playsinline={true}
			onCanPlayThrough={() => setLoaded(true)}
		/>
	)
}

export default VideoEmbed
