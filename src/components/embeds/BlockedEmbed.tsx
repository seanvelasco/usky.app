import { A } from '@solidjs/router'
import type { BlockedEmbed as BlockedEmbedType } from '../../types'
import commonStyles from './Embed.module.css'

const BlockedEmbed = (props: BlockedEmbedType) => {
	const id = ''
	return (
		<A
			href={`/profile/${props?.author?.did}/post/${id}`}
			class={`${commonStyles.embed} ${commonStyles.record}`}
			style={{
				display: 'flex',
				'flex-direction': 'column'
			}}
		>
			<p>
				Post hidden because one of the users involved blocked the other
			</p>
		</A>
	)
}

export default BlockedEmbed
