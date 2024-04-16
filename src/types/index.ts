export interface Viewer {
	muted: boolean;
	blockedBy: boolean;
}

export interface Actor {
	did: string;
	handle: string;
	displayName?: string;
	avatar?: string;
	labels: unknown[];
	description?: string;
}

export interface Profile {
	did: string;
	handle: string;
	displayName?: string;
	description?: string;
	avatar?: string;
	banner?: string;
	followsCount: number;
	followersCount: number;
	postsCount: number;
	indexedAt: string;
	labels: unknown[];
}

export interface ImageBlob {
	$type: "blob";
	ref: {
		$link: string;
	};
	mimeType: string;
	size: number;
}

export interface Record {
	text: string;
	embed?: Embed;
	langs: string[];
	facets?: unknown;
	createdAt: string;
}

export interface ExternalEmbed {
	$type: "app.bsky.embed.external#view" | "app.bsky.embed.external";
	title?: string;
	uri: string;
	thumb?: ImageBlob | string;
	description?: string;
}

export interface ImageEmbed {
	thumb: string;
	fullsize: string;
	alt: string;
	aspectRatio?: {
		width: number;
		height: number;
	};
	image?: ImageBlob;
}

export interface RecordEmbed {
	uri: string;
	cid: string;
	labels: string[];
	indexedAt: string;
}

export interface PostEmbed extends RecordEmbed {
	$type: "app.bsky.embed.record#viewRecord" | "app.bsky.embed.record";
	author: Actor;
	value: {
		text: string;
		langs: string[];
		embed: Embed;
		reply?: {
			root?: {
				cid: string;
				uri: string;
			};
			parent?: {
				cid: string;
				uri: string;
			};
			createdAt: string;
		};
		createdAt: string;
		facets?: {
			index: unknown;
			features: {
				uri: string;
			}[];
		}[];
	};
	labels: string[];
	indexedAt: string;
	embeds: Embed[];

	blocked?: boolean;
}

export interface DeletedEmbed
	extends Omit<RecordEmbed, "cid" | "labels" | "indexedAt"> {
	$type: "app.bsky.embed.record#viewNotFound";
	notFound: true;
}

export interface BlockedEmbed
	extends Omit<RecordEmbed, "cid" | "labels" | "indexedAt"> {
	$type: "app.bsky.embed.record#viewBlocked";
	blocked: true;
	author: Pick<Actor, "did">;
}

export interface GeneratorEmbed extends RecordEmbed {
	$type: "app.bsky.feed.defs#generatorView";
	creator: Actor;
	displayName?: string;
	description?: string;
	avatar?: string;
	likeCount: number;
}

export interface ListEmbed extends RecordEmbed {
	$type: "app.bsky.graph.defs#listView";
	creator: Actor;
	name?: string;
	description?: string;
	avatar?: string;
	likeCount: number;
}

export type Embed =
	| {
			$type: "app.bsky.embed.record#view" | "app.bsky.embed.record";
			record:
				| PostEmbed
				| GeneratorEmbed
				| ListEmbed
				| DeletedEmbed
				| BlockedEmbed;
	  }
	| {
			$type:
				| "app.bsky.embed.recordWithMedia#view"
				| "app.bsky.embed.recordWithMedia";
			record: {
				record: PostEmbed;
			};
			media: {
				images: ImageEmbed[];
			};
	  }
	| {
			$type: "app.bsky.embed.images#view" | "app.bsky.embed.images";
			images: ImageEmbed[];
	  }
	| {
			$type: "app.bsky.embed.external#view" | "app.bsky.embed.external";
			external: ExternalEmbed;
	  };

export interface Reason {
	$type: "app.bsky.feed.defs#reasonRepost";
	by: Actor;
	indexedAt: string;
}

export interface FirehosePost {
	text: string
	$type: "app.bsky.feed.post"
	langs: string[]
	reply: {
		root: {
			cid: string
			uri: string
		},
		parent: {
			cid: string
			uri: string
		}
	},
	createdAt: string
}

export interface FeedPost {
	uri: string;
	cid: string;
	author: Omit<Actor, "viewer">;
	record: Record;
	embed?: Embed;
	replyCount: number;
	repostCount: number;
	likeCount: number;
	indexedAt: string;
	// viewer: Viewer
	labels: unknown[];
}

export interface ThreadPost {
	$type: "app.bsky.feed.defs#threadViewPost";
	post: FeedPost;
	parent?: ThreadParentOrReply;
	replies?: ThreadParentOrReply[];
	notFound?: boolean;
}

export interface Thread {
	post: FeedPost;
	parent?: FeedPost;
	reply?: {
		root: FeedPost;
		parent: FeedPost;
	};
	reason?: Reason;
}

export interface ThreadParentOrReply {
	$type?: "app.bsky.feed.defs#threadViewPost";
	post: FeedPost;
	parent?: ThreadParentOrReply;
	replies?: ThreadParentOrReply[];
	notFound?: boolean;
}

export interface Feed {
	uri: string;
	cid: string;
	did: string;
	creator: Actor;
	displayName: string;
	description: string;
	avatar?: string;
	likeCount: number;
	indexedAt: string;
}

export interface FeedGenerator {
	view: Feed;
	isOnline: boolean;
	isValid: boolean;
}

export interface List {
	uri: string;
	cid: string;
	name: string;
	purpose: "app.bsky.graph.defs#modlist" | string;
	indexedAt: string;
	viewer: Viewer;
	creator: Actor;
	description: string;
}
