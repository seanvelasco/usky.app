import { Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import BlockedEmbed from './BlockedEmbed'
import DeletedEmbed from './DeletedEmbed'
import ExternalEmbed from './ExternalEmbed'
import GeneratorEmbed from './GeneratorEmbed'
import ImageEmbed from './ImageEmbed'
import ListEmbed from './ListEmbed'
import PostEmbed from './PostEmbed'
import VideoEmbed from './VideoEmbed'
import type {
	BlockedEmbed as BlockedEmbedType,
	DeletedEmbed as DeletedEmbedType,
	Embed as EmbedType,
	GeneratorEmbed as GeneratorEmbedType,
	ImageEmbed as ImageEmbedType,
	ListEmbed as ListEmbedType,
	PostEmbed as PostEmbedType,
	ExternalEmbed as ExternalEmbedType
} from '../../types'

const RecordWithMedia = (props: {
	record: {
		record: PostEmbedType
	}
	media: {
		images?: ImageEmbedType[]
		external?: ExternalEmbedType
	}
	did: string
}) => {
	return (
		<>
			<Show when={props.media.external}>
				{(external) => (
					<ExternalEmbed
						external={external()}
						did={props?.record?.record?.author?.did || props?.did}
					/>
				)}
			</Show>
			<Show when={props.media.images}>
				{(images) => (
					<ImageEmbed
						images={images()}
						did={props?.record?.record?.author?.did || props?.did}
					/>
				)}
			</Show>
			<PostEmbed {...props?.record?.record} />
		</>
	)
}

type Record =
	| PostEmbedType
	| GeneratorEmbedType
	| ListEmbedType
	| DeletedEmbedType
	| BlockedEmbedType

const record = {
	'app.bsky.embed.record': PostEmbed,
	'app.bsky.embed.record#viewRecord': PostEmbed,
	'app.bsky.feed.defs#generatorView': GeneratorEmbed,
	'app.bsky.graph.defs#listView': ListEmbed,
	'app.bsky.embed.record#viewNotFound': DeletedEmbed,
	'app.bsky.embed.record#viewBlocked': BlockedEmbed
}

const RecordEmbed = (props: { record: Record }) => {
	return <Dynamic component={record[props.record.$type]} {...props.record} />
}

const embed = {
	'app.bsky.embed.images#view': ImageEmbed,
	'app.bsky.embed.images': ImageEmbed,
	'app.bsky.embed.external#view': ExternalEmbed,
	'app.bsky.embed.external': ExternalEmbed,
	'app.bsky.embed.record#view': RecordEmbed,
	'app.bsky.embed.record': RecordEmbed,
	'app.bsky.embed.recordWithMedia#view': RecordWithMedia,
	'app.bsky.embed.recordWithMedia': RecordWithMedia,
	"app.bsky.embed.video#view": VideoEmbed,
	"app.bsky.embed.video": VideoEmbed
}

const Embed = (props: { embed: EmbedType; did: string }) => (
	<Dynamic
		component={embed[props?.embed?.$type]}
		{...props.embed}
		did={props?.did}
	/>
)

export default Embed
