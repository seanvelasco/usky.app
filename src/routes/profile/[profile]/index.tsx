import { For, Show, Suspense, ErrorBoundary, lazy } from 'solid-js'
import { A, createAsync, type RouteSectionProps } from '@solidjs/router'
import { Link, Meta, Title } from '@solidjs/meta'
import Post from '../../../components/Post'
import getProfile from '../../../api/actor/getProfile'
import getAuthorFeed from '../../../api/feed/getAuthorFeed'
import styles from './styles.module.css'
import Button from '../../../components/Button'
import Spinner from '../../../components/Spinner'
const RichText = lazy(() => import('../../../components/RichText'))

export const Fallback = (props: { text?: string }) => (
	<div class={styles.fallback}>
		<p>{props?.text ?? 'No posts yet'}</p>
	</div>
)

export const Posts = (props: RouteSectionProps) => {
	const posts = createAsync(() => getAuthorFeed(props.params.profile))
	const profile = createAsync(() => getProfile(props.params.profile))

	const title = () =>
		`${profile()?.displayName || profile()?.handle} (@${profile()?.handle}) - Bluesky (usky.app)`
	const url = () => `https://usky.app/profile/${profile()?.handle}`

	return (
		<>
			<Title>{title()}</Title>
			<Meta name='og:title' content={title()} />
			<Meta property='og:url' content={url()} />
			<Meta name='twitter:title' content={title()} />
			<Meta property='twitter:url' content={url()} />
			<Link rel='canonical' href={url()} />
			<ErrorBoundary
				fallback={<Fallback text='Unable to display posts' />}
			>
				<For each={posts()?.feed} fallback={<Fallback />}>
					{(post) => (
						<Show when={!post?.reply}>
							<Post {...post} />
						</Show>
					)}
				</For>
			</ErrorBoundary>
		</>
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
	const profile = createAsync(() => getProfile(props.params.profile))

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

	const avatar = () => profile()?.avatar ?? '/avatar.svg'

	return (
		<>
			<Show when={profile()}>
				<ErrorBoundary fallback={null}>
					{/* description */}
					<Meta name='description' content={profile()?.description} />
					<Meta
						property='og:description'
						content={profile()?.description}
					/>
					<Meta property='og:image' content={avatar()} />
					<Meta
						property='og:image:type'
						content={profile()?.avatar ? 'image/jpeg' : 'image/svg'}
					/>
					<Meta property='og:type' content='profile' />
					<Meta
						property='profile:username'
						content={profile()?.handle}
					/>
					<Meta
						name='twitter:description'
						content={profile()?.description}
					/>
					<Meta name='twitter:image' content={avatar()} />
					<Meta name='twitter:card' content='summary' />
				</ErrorBoundary>
			</Show>
			<Suspense>
				<Show when={profile()}>
					<div class={styles.profile}>
						<div>
							<div class={styles.banner}>
								<Show when={profile()?.banner}>
									<img
										src={profile()?.banner?.replace(
											'jpeg',
											'webp'
										)}
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
										profile()?.displayName ??
										profile()?.handle
									} avatar`}
									draggable='false'
								/>
							</div>
							<div class={styles.buttons}>
								<Button>Follow</Button>
							</div>
							<div class={styles.info}>
								<p class={styles.name}>
									{profile()?.displayName ||
										profile()?.handle}
								</p>
								<p class={styles.handle}>
									@{profile()?.handle}
								</p>
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
					<Suspense fallback={<Spinner />}>{props.children}</Suspense>
				</Show>
			</Suspense>
		</>
	)
}

export default Profile
