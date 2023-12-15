import type { PostEmbed as PostEmbedType } from "../../types"
import { createResource } from "solid-js"
import getPostThread from "../../api/feed/getPostThread"
import PostEmbed from "./PostEmbed"

export const LazyLoadEmbed = (props: PostEmbedType) => {
	const [post] = createResource(() => props?.uri, getPostThread)
	return <PostEmbed {...(post()?.thread?.post as any)} />
}

export default LazyLoadEmbed
