import { ImageBlob, Profile } from '../types'
import { session } from '../storage/session'

export const id = (uri: string) => {
	if (!uri) return null
	// const regex = /\/(\w+)$/
	// const match = regex.exec(uri);

	// if (match) {
	//     return match[1]
	// }

	const parts = uri.split('/')
	return parts[parts.length - 1]
}

export const did = (uri: string) => {
	if (uri) {
		const regex = /did:plc:\w+/
		const match = uri.match(regex)

		if (match) {
			return match[0]
		} else {
			return '' // Return null if no match is found
		}
	}
	return ''
}

export const isDID = (did: string) => {
	const regex = /did:plc:\w+/
	return regex.test(did)
}

export const createImageLink = (
	props: { image?: ImageBlob | string; did?: string } | { image: string }
) => {
	if (typeof props.image === 'string') {
		return props.image?.replace('jpeg', 'webp')
	} else if (
		typeof props.image === 'object' &&
		'did' in props &&
		'ref' in props.image
	) {
		const link = props.image.ref?.$link ?? props.image.ref.toString()
		return `https://cdn.bsky.app/img/feed_thumbnail/plain/${props.did}/${link}@webp`
	}
}

export const isOwnProfile = (profile: Profile) =>
	profile.did && session.did === profile.did
