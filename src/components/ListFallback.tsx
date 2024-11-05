import styles from './ListFallback.module.css'

const Fallback = (props: { text?: string }) => (
	<div class={styles.fallback}>
		<p>{props?.text ?? 'No posts yet'}</p>
	</div>
)

export default Fallback
