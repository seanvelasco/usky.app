import { createSignal, ErrorBoundary, For, Show, Suspense } from 'solid-js'
import { A, createAsync, cache, type RouteSectionProps } from '@solidjs/router'
import { Link, Meta, Title } from '@solidjs/meta'
import Post from '../../../components/Post'
import getProfile from '../../../api/actor/getProfile'
import getAuthorFeed from '../../../api/feed/getAuthorFeed'
import RichText from '../../../components/RichText'
import styles from './styles.module.css'
import type { Profile } from '../../../types'

export const Fallback = (props: { text?: string }) => (
	<div class={styles.fallback}>
		<p>{props?.text ?? 'No posts yet'}</p>
	</div>
)

export const getProfileData = cache(
	async (profile: string) => await getProfile(profile),
	'profile'
)

export const getPostsData = cache(
	async (profile: string) => await getAuthorFeed(profile),
	'profile_posts'
)

export const Posts = (props: RouteSectionProps) => {
	const posts = createAsync(() => getPostsData(props.params.profile))

	return (
		<ErrorBoundary fallback={<Fallback text='Unable to display posts' />}>
			<For each={posts()?.feed} fallback={<Fallback />}>
				{(post) => (
					<Show when={!post?.reply}>
						<Post {...post} />
					</Show>
				)}
			</For>
		</ErrorBoundary>
	)
}

export const ProfileNav = (
	routes: { title: string; href: string; hidden?: boolean }[]
) => {
	return (
		<nav class={styles.nav}>
			<For each={routes}>
				{(route) => (
					<Show when={!route.hidden}>
						<A
							noScroll={true}
							end={true}
							activeClass='underline'
							href={route.href}
						>
							{route.title}
						</A>
					</Show>
				)}
			</For>
		</nav>
	)
}

const ProfileMeta = (props: { profile: Profile | undefined }) => {
	const [title] = createSignal(
		`${props.profile?.displayName ?? props.profile?.handle} (@${props.profile?.handle}) - Bluesky (usky.app)`
	)
	const [description] = createSignal(props.profile?.description)
	const [url] = createSignal(
		`https://usky.app/profile/${props.profile?.handle}`
	)
	const [avatar] = createSignal(props.profile?.avatar ?? '/avatar.svg')

	return (
		<ErrorBoundary fallback={<Title>{title()}</Title>}>
			<Title>{title()}</Title>
			<Meta name='og:title' content={title()} />
			<Meta name='description' content={description()} />
			<Meta property='og:description' content={description()} />
			<Meta property='og:url' content={url()} />
			<Meta property='og:image' content={avatar()} />
			<Meta
				property='og:image:type'
				content={props.profile?.avatar ? 'image/jpeg' : 'image/svg'}
			/>
			<Meta property='og:type' content='profile' />
			<Meta property='profile:username' content={props.profile?.handle} />
			<Meta name='twitter:title' content={title()} />
			<Meta name='twitter:description' content={description()} />
			<Meta property='twitter:url' content={url()} />
			<Meta name='twitter:image' content={avatar()} />
			<Meta name='twitter:card' content='summary' />
			<Link rel='canonical' href={url()} />
		</ErrorBoundary>
	)
}

const Profile = (props: RouteSectionProps) => {
	const profile = createAsync(() => getProfileData(props.params.profile))

	const routes = [
		{
			title: 'Posts',
			href: ''
		},
		{
			title: 'Replies',
			href: 'replies'
		},
		{
			title: 'Media',
			href: 'media'
		},
		{
			title: 'Likes',
			href: 'likes'
		},
		{
			title: 'Feeds',
			href: 'feed',
			hidden: false
		},
		{
			title: 'Lists',
			href: 'lists',
			hidden: false
		}
	]

	return (
		<Suspense>
			<Show when={profile()}>
				<ProfileMeta profile={profile()} />
				<div class={styles.profile}>
					<div>
						<div class={styles.banner}>
							<Show when={profile()?.banner}>
								<img
									src={profile()?.banner}
									alt={`${
										profile()?.displayName ??
										profile()?.handle
									} banner`}
									draggable='false'
								/>
							</Show>
						</div>
						<div class={styles.avatar}>
							<img
								src={profile()?.avatar ?? '/avatar.svg'}
								alt={`${
									profile()?.displayName ?? profile()?.handle
								} avatar`}
								draggable='false'
							/>
						</div>
						<div class={styles.buttons}>
							<button type='button' class={styles.button}>
								Follow
							</button>
						</div>
						<div class={styles.info}>
							<p class={styles.name}>
								{profile()?.displayName || profile()?.handle}
							</p>
							<p class={styles.handle}>@{profile()?.handle}</p>
							<Show when={profile()?.description}>
								{(description) => (
									<p class={styles.description}>
										<RichText text={description()} />
									</p>
								)}
							</Show>
							<div class={styles.counters}>
								<A
									href={`/profile/${profile()?.handle}/following`}
								>
									<span>
										{profile()?.followsCount.toLocaleString()}
									</span>{' '}
									following
								</A>
								<A
									href={`/profile/${profile()?.handle}/followers`}
								>
									<span>
										{profile()?.followersCount.toLocaleString()}
									</span>{' '}
									followers
								</A>
								<A href={`/profile/${profile()?.handle}`}>
									<span>
										{profile()?.postsCount.toLocaleString()}
									</span>{' '}
									posts
								</A>
							</div>
						</div>
						<ProfileNav {...routes} />
					</div>
				</div>
				{props.children}
			</Show>
		</Suspense>
	)
}

export default Profile
