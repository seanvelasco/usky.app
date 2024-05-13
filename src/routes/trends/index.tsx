import { ErrorBoundary, For, Suspense } from 'solid-js'
import { cache, createAsync, A } from '@solidjs/router'
import { Link, Meta, Title } from '@solidjs/meta'
import Spinner from '../../components/Spinner'
import styles from '../../components/Entry.module.css'
import getPopularTags from '../../api/custom/trends'

export const getTranding = cache(
	async (limit?: number) => await getPopularTags(limit),
	'trends'
)

const Entry = (props: { hashtag: string; count: number; order: number }) => (
	<div class={styles.entry}>
		<div>
			<p class={styles.subtitle}>{props.order.toLocaleString()}</p>
			<A
				class={`${styles.name} ${styles.hashtag}`}
				href={`/hashtag/${props.hashtag}`}
			>
				#{props.hashtag}
			</A>
			<p class={styles.subtitle}>{props.count.toLocaleString()} posts</p>
		</div>
		<A class={styles.wrapper} href={`/hashtag/${props.hashtag}`}></A>
	</div>
)

const Trends = () => {
	const trends = createAsync(() => getTranding(100))
	const title = 'Trends - Bluesky (usky.app)'
	const description = 'Trending hashtags on Bluesky'
	const url = 'https://usky.app/trends'

	return (
		<>
			<ErrorBoundary fallback={<Title>{title}</Title>}>
				<Title>{title}</Title>
				<Meta name='description' content={description} />
				<Meta property='og:title' content={title} />
				<Meta property='og:description' content={description} />
				<Meta property='og:url' content={url} />
				<Meta name='twitter:title' content={title} />
				<Meta name='twitter:description' content={description} />
				<Meta property='twitter:url' content={url} />
				<Link rel='canonical' href={url} />
			</ErrorBoundary>
			<Suspense fallback={<Spinner />}>
				<For each={trends()} fallback={<p>No trending tags</p>}>
					{(trend, order) => (
						<Entry
							hashtag={trend.hashtag}
							count={trend.count}
							order={order() + 1}
						/>
					)}
				</For>
			</Suspense>
		</>
	)
}

export default Trends
