// import { onMount, createEffect, createSignal } from 'solid-js'
import { RichText } from '@atproto/api'
import type { Facet } from '../types'
// import { useAgent } from '../states/agent'

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

// todo: implement own rich text parser
// old bundle size before using @atproto/api : 110.34 kB │ gzip: 156.46 kB
// new bundle size after using @atproto/api: 721.38 kB │ gzip: 33.56 kB
// difference of 611.04 kB │ gzip: 122.9 kB
// the edge of usky.app is its lightweightness, so we should limit the use of external libs

const RichTextComponent = (props: {
	text: string
	facets?: Facet[] | undefined
}) => {
	// const agent = useAgent()
	//
	// if (!props.facets) {
	// 	rt.detectFacetsWithoutResolution()
	// }

	// for (const segment of rt.segments()) {
	// 	if (segment.link) {
	// 		setText((prev) => (prev += `<A href="${segment.link?.uri}">${segment.text}</A>`))
	//
	// 		// text += `<A target='_blank' rel='nofollow' href="${segment.link.uri}">${segment.text}</A>`
	// 	} else if (segment.mention) {
	// 		setText((prev) => (prev += `<A href="${segment.mention?.did}">${segment.text}</A>`))
	//
	// 		// text += `<A href="/profile/${segment.mention.did}">${segment.text}</A>`
	// 	} else if (segment.tag) {
	// 		setText((prev) => (prev += `<A href="/hashtag/${segment.tag?.tag}">${segment.text}</A>`))
	//
	// 		// text += `<A href="/hashtag/${segment.tag.tag}">${segment.text}</A>`
	// 	} else {
	// 		setText((prev) => (prev += segment.text))
	// 	}
	// }

	return (
		<span
			style={{ display: 'contents' }}
			innerHTML={rter({ text: props.text, facets: props.facets })}
		/>
	)
}

export default RichTextComponent
