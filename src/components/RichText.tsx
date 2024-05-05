import { RichText } from '@atproto/api'
import type { Facet } from '../types'

// todo: implement own rich text parser
// old bundle size before using @atproto/api : 110.34 kB │ gzip: 156.46 kB
// new bundle size after using @atproto/api: 721.38 kB │ gzip: 33.56 kB
// difference of 611.04 kB │ gzip: 122.9 kB
// the edge of usky.app is its lightweightness, so we should limit the use of external libs

const RichTextComponent = (props: {
	text: string
	facets: Facet[] | undefined
}) => {
	let text = ''

	if (!props.facets) {
		return <p style={{ display: 'contents' }}>{props.text}</p>
	}

	const rt = new RichText({
		text: props.text,
		facets: props.facets as any
	})

	rt.detectFacetsWithoutResolution()

	for (const segment of rt.segments()) {
		if (segment.link) {
			console.log(segment.text)
			text += `<A href="${segment.link.uri}">${segment.text}</A>`
		} else if (segment.mention) {
			text += `<A href="/profile/${segment.mention.did}">${segment.text}</A>`
		} else if (segment.tag) {
			text += `<A href="/hashtag/${segment.tag.tag}">${segment.text}</A>`
		} else {
			text += segment.text
		}
	}

	return <p style={{ display: 'contents ' }} innerHTML={text} />
}

export default RichTextComponent
