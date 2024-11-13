import { tlds } from '../constants'
import { clone } from '.'
import resolveHandle from '../api/identity/resolveHandle'

// below code is from https://github.com/bluesky-social/atproto/blob/9e18ab6a35f47e0a9cee76221bfa0817c8a624a1/packages/api/src/rich-text/rich-text.ts#L161 with modifications

interface RichTextProps {
	text: string
	facets?: Facet[]
}

interface RichTextOpts {
	cleanNewlines?: boolean
}

type FacetLink = {
	uri: string
	[k: string]: unknown
}
type FacetMention = {
	did: string
	[k: string]: unknown
}
type FacetTag = {
	tag: string
	[k: string]: unknown
}

interface ByteSlice {
	byteStart: number
	byteEnd: number
	[k: string]: unknown
}

type Facet = {
	index: ByteSlice
	features: (
		| FacetMention
		| FacetLink
		| FacetTag
		| { $type: string; [k: string]: unknown }
	)[]
	[k: string]: unknown
}

const MENTION_REGEX = /(^|\s|\()(@)([a-zA-Z0-9.-]+)(\b)/g
const URL_REGEX =
	/(^|\s|\()((https?:\/\/[\S]+)|((?<domain>[a-z][a-z0-9]*(\.[a-z0-9]+)+)[\S]*))/gim
const TRAILING_PUNCTUATION_REGEX = /\p{P}+$/gu

const TAG_REGEX =
	/(^|\s)[#＃]((?!\ufe0f)[^\s\u00AD\u2060\u200A\u200B\u200C\u200D\u20e2]*[^\d\s\p{P}\u00AD\u2060\u200A\u200B\u200C\u200D\u20e2]+[^\s\u00AD\u2060\u200A\u200B\u200C\u200D\u20e2]*)?/gu

const EXCESS_SPACE_RE = /[\r\n]([\u00AD\u2060\u200D\u200C\u200B\s]*[\r\n]){2,}/
const REPLACEMENT_STR = '\n\n'

const facetSort = (a: Facet, b: Facet) => a.index.byteStart - b.index.byteStart

const sanitize = (richText: RichText, opts: { cleanNewlines?: boolean }) => {
	if (!opts.cleanNewlines) return richText
	return clean(richText, EXCESS_SPACE_RE, REPLACEMENT_STR)
}

const clean = (
	richText: RichText,
	targetRegexp: RegExp,
	replacementString: string
): RichText => {
	richText = richText.clone()
	let match = richText.unicodeText.utf16.match(targetRegexp)
	while (match && typeof match.index !== 'undefined') {
		const oldText = richText.unicodeText
		const removeStartIndex = richText.unicodeText.utf16IndexToUtf8Index(
			match.index
		)
		const removeEndIndex =
			removeStartIndex + new UnicodeString(match[0]).length
		richText.delete(removeStartIndex, removeEndIndex)
		if (richText.unicodeText.utf16 === oldText.utf16) {
			break
		}
		richText.insert(removeStartIndex, replacementString)
		match = richText.unicodeText.utf16.match(targetRegexp)
	}
	return richText
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()

class UnicodeString {
	utf16: string
	utf8: Uint8Array

	constructor(utf16: string) {
		this.utf16 = utf16
		this.utf8 = encoder.encode(utf16)
	}

	get length() {
		return this.utf8.byteLength
	}

	slice(start?: number, end?: number): string {
		return decoder.decode(this.utf8.slice(start, end))
	}

	utf16IndexToUtf8Index(i: number) {
		return encoder.encode(this.utf16.slice(0, i)).byteLength
	}

	toString() {
		return this.utf16
	}
}

const detectFacets = (text: UnicodeString): Facet[] | undefined => {
	let match
	const facets: Facet[] = []
	{
		const re = MENTION_REGEX
		while ((match = re.exec(text.utf16))) {
			if (!isValidDomain(match[3]) && !match[3].endsWith('.test')) {
				continue
			}

			const start = text.utf16.indexOf(match[3], match.index) - 1
			facets.push({
				$type: 'app.bsky.richtext.facet',
				index: {
					byteStart: text.utf16IndexToUtf8Index(start),
					byteEnd: text.utf16IndexToUtf8Index(
						start + match[3].length + 1
					)
				},
				features: [
					{
						$type: 'app.bsky.richtext.facet#mention',
						did: match[3]
					}
				]
			})
		}
	}
	{
		while ((match = URL_REGEX.exec(text.utf16))) {
			let uri = match[2]
			if (!uri.startsWith('http')) {
				const domain = match.groups?.domain
				if (!domain || !isValidDomain(domain)) {
					continue
				}
				uri = `https://${uri}`
			}
			const start = text.utf16.indexOf(match[2], match.index)
			const index = { start, end: start + match[2].length }
			if (/[.,;:!?]$/.test(uri)) {
				uri = uri.slice(0, -1)
				index.end--
			}
			if (/[)]$/.test(uri) && !uri.includes('(')) {
				uri = uri.slice(0, -1)
				index.end--
			}
			facets.push({
				index: {
					byteStart: text.utf16IndexToUtf8Index(index.start),
					byteEnd: text.utf16IndexToUtf8Index(index.end)
				},
				features: [
					{
						$type: 'app.bsky.richtext.facet#link',
						uri
					}
				]
			})
		}
	}
	{
		const re = TAG_REGEX
		while ((match = re.exec(text.utf16))) {
			const leading = match[1]
			let tag = match[2]

			if (!tag) continue

			tag = tag.trim().replace(TRAILING_PUNCTUATION_REGEX, '')

			if (tag.length === 0 || tag.length > 64) continue

			const index = match.index + leading.length

			facets.push({
				index: {
					byteStart: text.utf16IndexToUtf8Index(index),
					byteEnd: text.utf16IndexToUtf8Index(index + 1 + tag.length)
				},
				features: [
					{
						$type: 'app.bsky.richtext.facet#tag',
						tag: tag
					}
				]
			})
		}
	}
	if (facets.length > 0) return facets
}

const isValidDomain = (str: string): boolean => {
	return !!tlds.find((tld) => {
		const i = str.lastIndexOf(tld)
		if (i === -1) {
			return false
		}
		return str.charAt(i - 1) === '.' && i === str.length - tld.length
	})
}

const isLink = (v: any): v is FacetLink =>
	v?.$type === 'app.bsky.richtext.facet#link'

const isMention = (v: any): v is FacetMention =>
	v?.$type === 'app.bsky.richtext.facet#mention'

const isTag = (v: any): v is FacetTag =>
	v?.$type === 'app.bsky.richtext.facet#tag'

class RichTextSegment {
	constructor(
		public text: string,
		public facet?: Facet
	) {}

	get link(): FacetLink | undefined {
		const link = this.facet?.features.find(isLink)
		if (isLink(link)) {
			return link
		}
	}

	isLink() {
		return !!this.link
	}

	get mention(): FacetMention | undefined {
		const mention = this.facet?.features.find(isMention)
		if (isMention(mention)) return mention
	}

	isMention() {
		return !!this.mention
	}

	get tag(): FacetTag | undefined {
		const tag = this.facet?.features.find(isTag)
		if (isTag(tag)) return tag
	}

	isTag() {
		return !!this.tag
	}
}

class RichText {
	unicodeText: UnicodeString
	facets?: Facet[]

	constructor(props: RichTextProps, opts?: RichTextOpts) {
		this.unicodeText = new UnicodeString(props.text)
		this.facets = props.facets
		if (this.facets) this.facets.sort(facetSort)
		if (opts?.cleanNewlines)
			sanitize(this, { cleanNewlines: true }).copyInto(this)
	}

	get text() {
		return this.unicodeText.toString()
	}

	get length() {
		return this.unicodeText.length
	}

	clone() {
		return new RichText({
			text: this.unicodeText.utf16,
			facets: clone(this.facets)
		})
	}

	copyInto(target: RichText) {
		target.unicodeText = this.unicodeText
		target.facets = clone(this.facets)
	}

	*segments(): Generator<RichTextSegment, void, void> {
		const facets = this.facets || []
		if (!facets.length) {
			yield new RichTextSegment(this.unicodeText.utf16)
			return
		}

		let textCursor = 0
		let facetCursor = 0
		do {
			const currFacet = facets[facetCursor]
			if (textCursor < currFacet.index.byteStart) {
				yield new RichTextSegment(
					this.unicodeText.slice(
						textCursor,
						currFacet.index.byteStart
					)
				)
			} else if (textCursor > currFacet.index.byteStart) {
				facetCursor++
				continue
			}
			if (currFacet.index.byteStart < currFacet.index.byteEnd) {
				const subtext = this.unicodeText.slice(
					currFacet.index.byteStart,
					currFacet.index.byteEnd
				)
				if (!subtext.trim()) {
					yield new RichTextSegment(subtext)
				} else {
					yield new RichTextSegment(subtext, currFacet)
				}
			}
			textCursor = currFacet.index.byteEnd
			facetCursor++
		} while (facetCursor < facets.length)
		if (textCursor < this.unicodeText.length) {
			yield new RichTextSegment(
				this.unicodeText.slice(textCursor, this.unicodeText.length)
			)
		}
	}

	insert(insertIndex: number, insertText: string) {
		this.unicodeText = new UnicodeString(
			this.unicodeText.slice(0, insertIndex) +
				insertText +
				this.unicodeText.slice(insertIndex)
		)

		if (!this.facets?.length) {
			return this
		}

		const numCharsAdded = insertText.length
		for (const ent of this.facets) {
			if (insertIndex <= ent.index.byteStart) {
				ent.index.byteStart += numCharsAdded
				ent.index.byteEnd += numCharsAdded
			} else if (
				insertIndex >= ent.index.byteStart &&
				insertIndex < ent.index.byteEnd
			) {
				ent.index.byteEnd += numCharsAdded
			}
		}
		return this
	}

	delete(removeStartIndex: number, removeEndIndex: number) {
		this.unicodeText = new UnicodeString(
			this.unicodeText.slice(0, removeStartIndex) +
				this.unicodeText.slice(removeEndIndex)
		)

		if (!this.facets?.length) {
			return this
		}

		const numCharsRemoved = removeEndIndex - removeStartIndex
		for (const ent of this.facets) {
			if (
				removeStartIndex <= ent.index.byteStart &&
				removeEndIndex >= ent.index.byteEnd
			) {
				ent.index.byteStart = 0
				ent.index.byteEnd = 0
			} else if (removeStartIndex > ent.index.byteEnd) {
			} else if (
				removeStartIndex > ent.index.byteStart &&
				removeStartIndex <= ent.index.byteEnd &&
				removeEndIndex > ent.index.byteEnd
			) {
				ent.index.byteEnd = removeStartIndex
			} else if (
				removeStartIndex >= ent.index.byteStart &&
				removeEndIndex <= ent.index.byteEnd
			) {
				ent.index.byteEnd -= numCharsRemoved
			} else if (
				removeStartIndex < ent.index.byteStart &&
				removeEndIndex >= ent.index.byteStart &&
				removeEndIndex <= ent.index.byteEnd
			) {
				ent.index.byteStart = removeStartIndex
				ent.index.byteEnd -= numCharsRemoved
			} else if (removeEndIndex < ent.index.byteStart) {
				ent.index.byteStart -= numCharsRemoved
				ent.index.byteEnd -= numCharsRemoved
			}
		}

		this.facets = this.facets.filter(
			(ent) => ent.index.byteStart < ent.index.byteEnd
		)
		return this
	}

	async detectFacets() {
		this.facets = detectFacets(this.unicodeText)
		if (this.facets) {
			for (const facet of this.facets) {
				for (const feature of facet.features) {
					if (isMention(feature)) {
						const did = await resolveHandle(feature.did)
						console.log(did)
						feature.did = did || ''
					}
				}
			}
			this.facets.sort(facetSort)
		}
	}

	detectFacetsWithoutResolution() {
		this.facets = detectFacets(this.unicodeText)
		if (this.facets) this.facets.sort(facetSort)
	}
}

export default RichText
