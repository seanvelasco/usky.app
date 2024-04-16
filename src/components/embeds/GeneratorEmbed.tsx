import { A } from '@solidjs/router'
import type { GeneratorEmbed as GeneratorEmbedType } from '../../types'
import Avatar from '../Avatar'
import commonStyles from './Embed.module.css'
import { id } from './../../utils'

const GeneratorEmbed = (props: GeneratorEmbedType) => {
	return (
		<div class={`${commonStyles.embed} ${commonStyles.record}`}>
			<Avatar
				src={props?.avatar ?? '/feed.svg'}
				alt={`${props?.displayName} avatar`}
				size='3.5rem'
			/>
			<div class={commonStyles.text}>
				<div>
					<A
						class={commonStyles.name}
						href={`/profile/${props?.creator.handle}/feed/${id(
							props.uri
						)}`}
					>
						{props?.displayName}
					</A>
					<p>
						Feed by{' '}
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
				aria-label={`${props?.displayName} feed`}
				href={`/profile/${props?.creator?.handle}/feed/${id(
					props.uri
				)}`}
			/>
		</div>
	)
}

export default GeneratorEmbed
