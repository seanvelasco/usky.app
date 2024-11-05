import { A } from '@solidjs/router'
import type { BlockedEmbed as BlockedEmbedType } from '../../types'
import styles from './Embed.module.css'

const BlockedEmbed = (props: BlockedEmbedType) => {
	const id = ''
	return (
		<A
			href={`/profile/${props?.author?.did}/post/${id}`}
			class={`${styles.embed} ${styles.record}`}
		>
			<p>
				Post hidden because one of the users involved blocked the other
			</p>
		</A>
	)
}

export default BlockedEmbed
