import { A } from '@solidjs/router'
import type { ListEmbed as ListEmbedType } from '../../types'
import Avatar from '../Avatar'
import commonStyles from './Embed.module.css'

const ListEmbed = (props: ListEmbedType) => {
	const id = ''

	return (
		<div class={`${commonStyles.embed} ${commonStyles.record}`}>
			<Avatar
				src={props?.avatar ?? '/feed.svg'}
				alt={`${props?.name} avatar`}
				size='3.5rem'
			/>
			<div class={commonStyles.text}>
				<div>
					<A
						class={commonStyles.name}
						href={`/profile/${props?.creator?.handle}/feed/${id}`}
					>
						{props?.name}
					</A>
					<p>
						List by{' '}
						<A
							rel='author'
							class={commonStyles.handle}
							href={`/profile/${props?.creator?.handle}`}
						>
							@{props?.creator?.handle}
						</A>
					</p>
				</div>
				<p class={commonStyles.description}>{props?.description}</p>
			</div>
			<A
				aria-label={`${props?.name} list`}
				href={`/profile/${props?.creator?.handle}/list/${id}`}
			></A>
		</div>
	)
}

export default ListEmbed
