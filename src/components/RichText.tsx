import RichText from '../utils/rt'
import type { Facet } from '../types'

const rter = ({
	text,
	facets
}: {
	text: string
	facets: Facet[] | any | undefined
}) => {
	let output = ''
	const rt = new RichText({
		text,
		facets
	})

	if (!facets) {
		rt.detectFacetsWithoutResolution()
	}

	for (const segment of rt.segments()) {
		if (segment.link) {
			output += `<A target='_blank' rel='nofollow' href="${segment.link.uri}">${segment.text}</A>`
		} else if (segment.mention) {
			output += `<A href="/profile/${segment.mention.did}">${segment.text}</A>`
		} else if (segment.tag) {
			output += `<A href="/hashtag/${segment.tag.tag}">${segment.text}</A>`
		} else {
			output += segment.text
		}
	}

	return output
}

const RichTextComponent = (props: { text: string; facets?: Facet[] }) => (
	<span
		style={{ display: 'contents' }}
		innerHTML={rter({ text: props.text, facets: props.facets })}
	/>
)

export default RichTextComponent
