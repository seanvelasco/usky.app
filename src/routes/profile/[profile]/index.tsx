import { createResource, Suspense, Show, For } from "solid-js"
import {
	A,
	Outlet,
	useRouteData,
	type RouteDataFuncArgs
} from "@solidjs/router"
import { Title, Link, Meta } from "@solidjs/meta"
import Post from "../../../components/Post"
import Entry from "../../../components/Entry"
import getProfile from "../../../api/actor/getProfile"
import listRecords from "../../../api/repo/listRecords"
import getPosts from "../../../api/getPostsOld"
import getFollowers from "../../../api/graph/getFollowers"
import getFollows from "../../../api/graph/getFollows"
import getAuthorFeed from "../../../api/feed/getAuthorFeed"
import getActorFeeds from "../../../api/feed/getActorFeeds"
import getLists from "../../../api/graph/getLists"
import { id } from "../../../utils"
import Spinner from "../../../components/Spinner"
import styles from "./styles.module.css"
import carouselStyles from "../../../components/MediaCarousel.module.css"
import type { FeedPost } from "../../../types"

export const ProfileData = ({ params }: RouteDataFuncArgs) => {
	const [profile] = createResource(() => params.profile, getProfile)
	return profile
}
export const PostsData = ({ params }: RouteDataFuncArgs) => {
	const [posts] = createResource(() => params.profile, getAuthorFeed)
	return posts
}

const getLikes = async (profile: string): Promise<{ posts: FeedPost[] }> => {
	const likes = await listRecords(profile, "app.bsky.feed.like")

	const { records } = likes // cursor

	const likedUris = []

	for (const like of records) {
		likedUris.push(like?.value?.subject?.uri)
	}

	return await getPosts(likedUris)
}

export const LikesData = ({ params }: RouteDataFuncArgs) => {
	const [posts] = createResource(() => params.profile, getLikes)
	return posts
}

export const FollowersData = ({ params }: RouteDataFuncArgs) => {
	const [followers] = createResource(() => params.profile, getFollowers)
	return followers
}

export const FollowingData = ({ params }: RouteDataFuncArgs) => {
	const [following] = createResource(() => params.profile, getFollows)
	return following
}

export const FeedsData = ({ params }: RouteDataFuncArgs) => {
	const [posts] = createResource(() => params.profile, getActorFeeds)
	return posts
}

export const ListsData = ({ params }: RouteDataFuncArgs) => {
	const [lists] = createResource(() => params.profile, getLists)
	return lists
}

export const Lists = () => {
	const lists = useRouteData<typeof ListsData>()

	if (lists.error) {
		return <p>Unable to retrieve lists</p>
	}

	return (
		<For each={lists()?.lists}>
			{(list) => (
				<>
					<Entry
						type="creator"
						displayName={list.name}
						description={list.description}
						avatar="/avatar_group.svg"
						href={`/profile/${list.creator.handle}/lists/${id(
							list.uri
						)}`}
					/>
				</>
			)}
		</For>
	)
}

export const Feeds = () => {
	const feeds = useRouteData<typeof FeedsData>()

	if (feeds.error) {
		return <p>Unable to retrieve feeds</p>
	}

	return (
		<For each={feeds()?.feeds}>
			{(feed) => (
				<Entry
					type="creator"
					displayName={feed.displayName}
					description={feed.description}
					avatar={feed.avatar ?? "/feed.svg"}
					href={`/profile/${feed.creator.handle}/feed/${feed.did}`}
				/>
			)}
		</For>
	)
}

export const Posts = () => {
	const posts = useRouteData<typeof PostsData>()

	if (posts.error) {
		return <p>Unable to retrieve posts</p>
	}

	return (
		<For each={posts()?.feed}>
			{(post) => (
				<Show when={!post?.reply}>
					<Post {...post} />
				</Show>
			)}
		</For>
	)
}

export const Following = () => {
	const following = useRouteData<typeof FollowingData>()

	if (following.error) {
		return <p>Unable to retrieve posts</p>
	}

	return (
		<For each={following()?.follows}>
			{(actor) => (
				<Entry
					displayName={actor?.displayName ?? actor.handle}
					handle={actor?.handle}
					description={actor?.description}
					avatar={actor.avatar ?? "/avatar.svg"}
					href={`/profile/${actor.handle}`}
				/>
			)}
		</For>
	)
}

export const Followers = () => {
	const followers = useRouteData<typeof FollowersData>()

	if (followers.error) {
		return <p>Unable to retrieve posts</p>
	}

	return (
		<For each={followers()?.followers}>
			{(actor) => (
				<Entry
					displayName={actor?.displayName ?? actor.handle}
					handle={actor?.handle}
					description={actor?.description}
					avatar={actor.avatar ?? "/avatar.svg"}
					href={`/profile/${actor.handle}`}
				/>
			)}
		</For>
	)
}

export const Replies = () => {
	const posts = useRouteData<typeof PostsData>()

	if (posts.error) {
		return <p>Unable to retrieve posts</p>
	}

	return (
		<For each={posts()?.feed}>
			{(post) => (
				<Show when={post?.reply && !post?.reason}>
					<Post {...post} />
				</Show>
			)}
		</For>
	)
}

export const Media = () => {
	const posts = useRouteData<typeof PostsData>()

	if (posts.error) {
		return <p>Unable to retrieve posts</p>
	}

	return (
		<div class={carouselStyles.carousel}>
			<For each={posts()?.feed}>
				{(post) => (
					<Show
						when={
							post?.post?.embed?.$type ===
								"app.bsky.embed.images#view" &&
							post?.post?.embed?.images
						}
					>
						{(images) => (
							<For each={images()}>
								{(image) => (
									<img src={image?.thumb} alt={image.alt} />
								)}
							</For>
						)}
					</Show>
				)}
			</For>
		</div>
	)
}

export const Likes = () => {
	const posts = useRouteData<typeof LikesData>()

	return (
		<For each={posts()?.posts}>
			{(post) => (
				<>
					<Post post={post} />
				</>
			)}
		</For>
	)
}

const ProfileNav = () => {
	const routes = [
		{
			title: "Posts",
			href: ""
		},
		{
			title: "Replies",
			href: "replies"
		},
		{
			title: "Media",
			href: "media"
		},
		{
			title: "Likes",
			href: "likes"
		},
		{
			title: "Feeds",
			href: "feed"
		},
		{
			title: "Lists",
			href: "lists"
		}
	]

	return (
		<nav class={styles.nav}>
			<For each={routes}>
				{(route) => (
					<A
						noScroll={true}
						end={true}
						activeClass="underline"
						href={route.href}
					>
						{route.title}
					</A>
				)}
			</For>
		</nav>
	)
}

const Profile = () => {
	const profile = useRouteData<typeof ProfileData>()

	return (
		<>
			<Title>
				{profile()?.displayName ?? profile()?.handle} (@
				{profile()?.handle}) - Bluesky (usky.app)
			</Title>
			<Meta name="description" content={profile()?.description} />
			<Meta property="og:description" content={profile()?.description} />
			<Meta
				property="og:url"
				content={`https://usky.app/profile/${profile()?.handle}`}
			/>
			<Meta
				property="og:image"
				content={profile()?.avatar ?? "/avatar.svg"}
			/>
			<Meta
				property="og:image:type"
				content={profile()?.avatar ? "image/jpeg" : "image/svg"}
			/>
			<Meta property="og:type" content="profile" />
			<Meta
				property="profile:first_name"
				content={profile()?.displayName}
			/>
			<Meta property="profile:username" content={profile()?.handle} />
			<Meta name="twitter:description" content={profile()?.description} />
			<Meta
				property="twitter:url"
				content={`https://usky.app/profile/${profile()?.handle}`}
			/>
			<Meta
				name="twitter:image"
				content={profile()?.avatar ?? "/avatar.svg"}
			/>
			<Meta name="twitter:card" content="summary" />
			<Link
				rel="canonical"
				href={`https://usky.app/profile/${profile()?.handle}`}
			/>
			<div class={styles.profile}>
				<Suspense fallback={<p>PLS WAIT</p>}>
					<div>
						<div class={styles.banner}>
							<Show when={profile()?.banner}>
								<img
									src={profile()?.banner}
									alt={`${
										profile()?.displayName ??
										profile()?.handle
									} banner`}
									draggable="false"
								/>
							</Show>
						</div>
						<div class={styles.avatar}>
							<img
								src={profile()?.avatar ?? "/avatar.svg"}
								alt={`${
									profile()?.displayName ?? profile()?.handle
								} avatar`}
								draggable="false"
							/>
						</div>
						<div class={styles.buttons}>
							<button class={styles.button}>Follow</button>
						</div>
						<div class={styles.info}>
							<p class={styles.name}>
								{profile()?.displayName ?? profile()?.handle}
							</p>
							<p class={styles.handle}>@{profile()?.handle}</p>
							<Show when={profile()?.description}>
								<p class={styles.description}>
									{profile()?.description}
								</p>
							</Show>
							<div class={styles.counters}>
								<A
									href={`/profile/${
										profile()?.handle
									}/following`}
								>
									<span>
										{profile()?.followsCount.toLocaleString()}
									</span>{" "}
									following
								</A>
								<A
									href={`/profile/${
										profile()?.handle
									}/followers`}
								>
									<span>
										{profile()?.followersCount.toLocaleString()}
									</span>{" "}
									followers
								</A>
								<A href={`/profile/${profile()?.handle}`}>
									<span>
										{profile()?.postsCount.toLocaleString()}
									</span>{" "}
									posts
								</A>
							</div>
						</div>
						<ProfileNav />
					</div>
				</Suspense>
			</div>
			<Suspense fallback={<Spinner />}>
				<Outlet />
			</Suspense>
		</>
	)
}

export default Profile
