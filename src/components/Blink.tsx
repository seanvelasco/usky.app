import styles from './Blink.module.css'

const Blink = () => (
	<div class={styles.indicator}>
		<div class={styles.dot}></div>
		<div class={styles.ping}></div>
	</div>
)

export default Blink
