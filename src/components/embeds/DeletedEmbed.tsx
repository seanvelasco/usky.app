import styles from './Embed.module.css'

const DeletedEmbed = () => {
	return (
		<div class={`${styles.embed} ${styles.record}`}>
			<p>This post is deleted</p>
		</div>
	)
}

export default DeletedEmbed
