// import { Link, Meta, Title } from '@solidjs/meta'
import { A, createAsync, cache, type RouteSectionProps } from '@solidjs/router'
import { For, Show, Suspense } from 'solid-js'

import Post from '../../../components/Post'

import getProfile from '../../../api/actor/getProfile'
import getAuthorFeed from '../../../api/feed/getAuthorFeed'

import styles from './styles.module.css'

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
		<For each={posts()?.feed}>
			{(post) => (
				<Show when={!post?.reply}>
					<Post {...post} />
				</Show>
			)}
		</For>
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
		<div>
			{/*<Title>*/}
			{/*	{profile()?.displayName ?? profile()?.handle} (@*/}
			{/*	{profile()?.handle}) - Bluesky (usky.app)*/}
			{/*</Title>*/}
			{/*<Meta name='description' content={profile()?.description} />*/}
			{/*<Meta property='og:description' content={profile()?.description} />*/}
			{/*<Meta*/}
			{/*	property='og:url'*/}
			{/*	content={`https://usky.app/profile/${profile()?.handle}`}*/}
			{/*/>*/}
			{/*<Meta*/}
			{/*	property='og:image'*/}
			{/*	content={profile()?.avatar ?? '/avatar.svg'}*/}
			{/*/>*/}
			{/*<Meta*/}
			{/*	property='og:image:type'*/}
			{/*	content={profile()?.avatar ? 'image/jpeg' : 'image/svg'}*/}
			{/*/>*/}
			{/*<Meta property='og:type' content='profile' />*/}
			{/*<Meta*/}
			{/*	property='profile:first_name'*/}
			{/*	content={profile()?.displayName}*/}
			{/*/>*/}
			{/*<Meta property='profile:username' content={profile()?.handle} />*/}
			{/*<Meta name='twitter:description' content={profile()?.description} />*/}
			{/*<Meta*/}
			{/*	property='twitter:url'*/}
			{/*	content={`https://usky.app/profile/${profile()?.handle}`}*/}
			{/*/>*/}
			{/*<Meta*/}
			{/*	name='twitter:image'*/}
			{/*	content={profile()?.avatar ?? '/avatar.svg'}*/}
			{/*/>*/}
			{/*<Meta name='twitter:card' content='summary' />*/}
			{/*<Link*/}
			{/*	rel='canonical'*/}
			{/*	href={`https://usky.app/profile/${profile()?.handle}`}*/}
			{/*/>*/}
			<div class={styles.profile}>
				<Suspense>
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
									</span>{' '}
									following
								</A>
								<A
									href={`/profile/${
										profile()?.handle
									}/followers`}
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
				</Suspense>
			</div>
			{props.children}
		</div>
	)
}

export default Profile
