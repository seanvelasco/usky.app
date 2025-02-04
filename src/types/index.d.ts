export interface Viewer {
	muted: boolean
	blockedBy: boolean
}

export interface Actor {
	did: string
	handle: string
	displayName?: string
	avatar?: string
	labels: unknown[]
	description?: string
}

export interface Profile {
	did: string
	handle: string
	displayName?: string
	description?: string
	avatar?: string
	banner?: string
	followsCount: number
	followersCount: number
	postsCount: number
	indexedAt: string
	labels: unknown[]
}

export interface ImageBlob {
	$type: 'blob'
	ref:
		| {
				$link: string
		  }
		| any
	mimeType: string
	size: number
}

export interface Record {
	$type?: 'app.bsky.feed.post'
	text: string
	embed?: Embed
	langs: string[]
	facets?: Facet[]
	createdAt: string
}

export interface Facet {}

export interface ExternalEmbed {
	$type: 'app.bsky.embed.external#view' | 'app.bsky.embed.external'
	title?: string
	uri: string
	thumb?: ImageBlob | string
	description?: string
}

export interface ImageEmbed {
	thumb: string
	fullsize: string
	alt: string
	aspectRatio?: {
		width: number
		height: number
	}
	image?: ImageBlob
}

export interface RecordEmbed {
	uri: string
	cid: string
	labels: string[]
	indexedAt: string
}

export interface PostEmbed extends RecordEmbed {
	$type: 'app.bsky.embed.record#viewRecord' | 'app.bsky.embed.record'
	author: Actor
	value: {
		text: string
		langs: string[]
		embed: Embed
		reply?: {
			root?: {
				cid: string
				uri: string
			}
			parent?: {
				cid: string
				uri: string
			}
			createdAt: string
		}
		createdAt: string
		facets?: {
			index: unknown
			features: {
				uri: string
			}[]
		}[]
	}
	labels: string[]
	indexedAt: string
	embeds: Embed[]
	blocked?: boolean
}

export interface DeletedEmbed
	extends Omit<RecordEmbed, 'cid' | 'labels' | 'indexedAt'> {
	$type: 'app.bsky.embed.record#viewNotFound'
	notFound: true
}

export interface BlockedEmbed
	extends Omit<RecordEmbed, 'cid' | 'labels' | 'indexedAt'> {
	$type: 'app.bsky.embed.record#viewBlocked'
	blocked: true
	author: Pick<Actor, 'did'>
}

export interface GeneratorEmbed extends RecordEmbed {
	$type: 'app.bsky.feed.defs#generatorView'
	creator: Actor
	displayName?: string
	description?: string
	avatar?: string
	likeCount: number
}

export interface ListEmbed extends RecordEmbed {
	$type: 'app.bsky.graph.defs#listView'
	creator: Actor
	name?: string
	description?: string
	avatar?: string
	likeCount: number
}

// todo: separate #view and non-view to allow type narrowing
export type Embed =
	| {
			$type: 'app.bsky.embed.record#view' | 'app.bsky.embed.record'
			record:
				| PostEmbed
				| GeneratorEmbed
				| ListEmbed
				| DeletedEmbed
				| BlockedEmbed
	  }
	| {
			$type:
				| 'app.bsky.embed.recordWithMedia#view'
				| 'app.bsky.embed.recordWithMedia'
			record: {
				record: PostEmbed
			}
			media: {
				images: ImageEmbed[]
			}
	  }
	| {
			$type: 'app.bsky.embed.images#view' | 'app.bsky.embed.images'
			images: ImageEmbed[]
	  }
	| {
			$type: 'app.bsky.embed.external#view' | 'app.bsky.embed.external'
			external: ExternalEmbed
	  }
	| VideoEmbedView
// | VideoEmbed

export type VideoEmbedView = {
	$type: 'app.bsky.embed.video#view'
	aspectRatio: {
		height: number
		width: number
	}
	cid: string
	playlist: string
	thumbnail: string
}

export type VideoEmbed = {
	$type: 'app.bsky.embed.video'
	aspectRatio: {
		height: number
		width: number
	}
	video: VideoBlob
}

export interface VideoBlob {
	$type: 'blob'
	ref: {
		$link: string
	}
	mimeType: string
	size: number
}

export interface Reason {
	$type: 'app.bsky.feed.defs#reasonRepost'
	by: Actor
	indexedAt: string
}

export interface FirehosePost {
	text: string
	embed: Embed
	faces: unknown
	$type: 'app.bsky.feed.post'
	langs: string[]
	reply: {
		root: {
			cid: string
			uri: string
		}
		parent: {
			cid: string
			uri: string
		}
	}
	createdAt: string
}

export interface FeedPost {
	uri: string
	cid: string
	author: Omit<Actor, 'viewer'>
	record: Record
	embed?: Embed
	replyCount: number
	repostCount: number
	likeCount: number
	indexedAt: string
	// viewer: Viewer
	labels: unknown[]
	notFound?: boolean
	blocked?: boolean
}

export interface ThreadPost {
	$type: 'app.bsky.feed.defs#threadViewPost'
	post: FeedPost
	parent?: ThreadParentOrReply
	replies?: ThreadParentOrReply[]
	notFound?: boolean
	boolean?: boolean
}

export interface Thread {
	post: FeedPost
	parent?: FeedPost
	reply?: {
		root: FeedPost
		parent: FeedPost
	}
	reason?: Reason
}

export interface ThreadParentOrReply {
	uri: string
	author: Pick<Actor, 'did'>
	$type?: 'app.bsky.feed.defs#threadViewPost'
	post: FeedPost
	parent?: ThreadParentOrReply
	replies?: ThreadParentOrReply[]
	notFound?: boolean
	blocked?: boolean
}

export interface Feed {
	uri: string
	cid: string
	did: string
	creator: Actor
	displayName: string
	description: string
	avatar?: string
	likeCount: number
	indexedAt: string
}

export interface FeedGenerator {
	view: Feed
	isOnline: boolean
	isValid: boolean
}

export interface List {
	uri: string
	cid: string
	name: string
	purpose: 'app.bsky.graph.defs#modlist' | string
	indexedAt: string
	viewer: Viewer
	creator: Actor
	description: string
}

export interface FirehosePayload extends FirehosePost {
	did: string
	path: string
}

export interface Header {
	op: number
	t: string
}

export interface Payload {
	blobs: unknown
	blocks: Uint8Array
	commit: {
		value: Uint8Array
		tag: number
	}
	ops: {
		action: 'create' | string
		cid: {
			value: Uint8Array
			tag: number
		}
		path: string
	}[]
	prev: unknown
	rebase: boolean
	repo: string
	rev: string
}

export interface Session {
	did: string
	didDoc: {
		'@context': string[]
		id: string
		alsoKnownAs: string[]
		verificationMethod: {
			id: string
			type: string
			controller: string
			publicKeyMultibase: string
		}[]
		service: {
			id: string
			type: string
			serviceEndpoint: string
		}[]
	}
	handle: string
	email: string
	emailConfirmed: boolean
	emailAuthFactor: boolean
	accessJwt: string
	refreshJwt: string
	active: boolean
}

interface Notification {
	uri: string
	cid: string
	author: Actor
	reason: string
	record: Record
	isRead: boolean
	indexedAt: string
	labels: unknown[]
}

export interface CreateAccountProps {
	email: string
	password: string
	handle: string
	inviteCode: string
	verificationCode: string
}

// {"cursor":"22222222jmobz","convos":[
// {"id":"3kw55tn5bww26","rev":"22222222jmobz",
// "members":[{"did":"did:plc:gjblkz2ashspospatvmeieel","handle":"seanvelasco.bsky.social","displayName":"Sean Velasco",
// "associated":{"lists":0,"feedgens":0,"starterPacks":0,"labeler":false,"chat":{"allowIncoming":"all"}},
// "viewer":{"muted":false,"blockedBy":false,"followedBy":"at://did:plc:gjblkz2ashspospatvmeieel/app.bsky.graph.follow/3krvmzkhzef2r"},"labels":[]},{"did":"did:plc:rzce2k6qit4s5kcmo4i6dfxb","handle":"sean.app","displayName":"sean.app","avatar":"https://cdn.bsky.app/img/avatar/plain/did:plc:rzce2k6qit4s5kcmo4i6dfxb/bafkreifdnzfx72k26mvu35j5emyzxfvq5ejwy2qnwggajabgzk3ajhjoxi@jpeg","associated":{"lists":1,"feedgens":0,"starterPacks":0,"labeler":false,"chat":{"allowIncoming":"all"}},"viewer":{"muted":false,"blockedBy":false,"knownFollowers":{"count":1,"followers":[{"did":"did:plc:gv2onfivqh55ew2ovuxhw5jj","handle":"isabellaa.bsky.social","displayName":"Isabella","avatar":"https://cdn.bsky.app/img/avatar/plain/did:plc:gv2onfivqh55ew2ovuxhw5jj/bafkreiblylsxdwckuyf3berdpzflajqswlhljvvjubzbkql76sihybmsau@jpeg","viewer":{"muted":false,"blockedBy":false,"following":"at://did:plc:rzce2k6qit4s5kcmo4i6dfxb/app.bsky.graph.follow/3k7ttespueh22","followedBy":"at://did:plc:gv2onfivqh55ew2ovuxhw5jj/app.bsky.graph.follow/3k7trjvcsbw2s"},"labels":[],"createdAt":"2023-09-19T20:55:36.929Z"}]}},"labels":[]}],"lastMessage":{"$type":"chat.bsky.convo.defs#messageView","id":"3kw55tqtlwc2l","rev":"22222222jmobz","sender":{"did":"did:plc:rzce2k6qit4s5kcmo4i6dfxb"},"text":"asd","sentAt":"2024-06-30T10:29:09.045Z"},"unreadCount":0,"muted":false}]}

interface ConvoMember {
	did: string
	handle: string
	displayName: string
	avatar: string
	associated: {
		list: number
		feedgens: number
		starterPacks: number
		labeler: boolean
		chat: {
			allowIncoming: 'all'
		}
	}
	viewer: {
		muted: boolean
		blockedBy: boolean
		followedBy: string
	}
	labels: unknown[]
}

export interface Convo {
	id: string
	rev: string
	members: ConvoMember[]
	lastMessage: {
		$type: string
		id: string
		rev: string
		sender: {
			did: string
		}
		text: string
		sentAt: string
	}
	unreadCount: number
	muted: false
}

export interface Message {
	$type: string
	id: string
	sender: {
		did: string
	}
	text: string
	sentAt: string
}

const m = {
	messages: [
		{
			$type: 'chat.bsky.convo.defs#messageView',
			id: '3kw55tqtlwc2l',
			rev: '22222222jmobz',
			sender: { did: 'did:plc:rzce2k6qit4s5kcmo4i6dfxb' },
			text: 'asd',
			sentAt: '2024-06-30T10:29:09.045Z'
		}
	],
	cursor: '22222222jmobz'
}
