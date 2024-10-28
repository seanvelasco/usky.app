import styles from './Avatar.module.css'
import type { JSX } from 'solid-js'

const Avatar = (
	props: {
		src?: string
		alt?: string
		size?: string
		style?: JSX.CSSProperties
	} = { size: '3.5rem' }
) => {
	props.size = props.size ?? '3rem'
	return (
		<img
			loading='lazy'
			draggable='false'
			class={styles.avatar}
			// style:border-radius={shape === "round" ? "50%" : "12px"}
			src={props.src?.replace('jpeg', 'webp') || '/avatar.svg'}
			alt={props.alt ?? 'Default avatar'}
			style={{
				'max-width': props.size,
				'max-height': props.size,
				...props.style
			}}
		/>
	)
}

export default Avatar
