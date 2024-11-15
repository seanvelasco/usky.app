// 22.98 24.47 42.24 123.98
import { lazy, Suspense } from 'solid-js'
import { MetaProvider } from '@solidjs/meta'
import { Router, Route } from '@solidjs/router'
import { render } from 'solid-js/web'
/* @refresh reload */
import App from './App'
import { session } from './storage/session'
// Home pages
const Timeline = lazy(() => import('./routes'))
const Discover = lazy(() => import('./routes/discover'))
const Hot = lazy(() => import('./routes/hot'))
const Firehose = lazy(() => import('./routes/live'))
// Profile pages
const Profile = lazy(() => import('./routes/profile/[profile]'))
const Posts = lazy(() => import('./routes/profile/[profile]/posts'))
const Replies = lazy(() => import('./routes/profile/[profile]/replies'))
const Media = lazy(() => import('./routes/profile/[profile]/media'))
const UserFeeds = lazy(() => import('./routes/profile/[profile]/feed'))
const Following = lazy(() => import('./routes/profile/[profile]/following'))
const Followers = lazy(() => import('./routes/profile/[profile]/followers'))
const Lists = lazy(() => import('./routes/profile/[profile]/lists'))
const Likes = lazy(() => import('./routes/profile/[profile]/likes'))
// Lists pages for feeds and lists
const Feed = lazy(() => import('./routes/profile/[profile]/feed/[feed]'))
const List = lazy(() => import('./routes/profile/[profile]/lists/[list]'))
// Post page
const Post = lazy(() => import('./routes/profile/[profile]/post/[post]'))
// Search pages
const SearchPage = lazy(() => import('./routes/search'))
import {
	Top,
	People,
	Latest,
	Media as MediaSearch,
	HashtagPage
} from './routes/search' // todo, vite warning
// Sidebar pages
const About = lazy(() => import('./routes/about'))
const Trends = lazy(() => import('./routes/trends'))
const PopularFeeds = lazy(() => import('./routes/feeds'))
// Pages that require auth
const Notifications = lazy(() => import('./routes/notifications'))
const Messages = lazy(() => import('./routes/messages'))
const Message = lazy(() => import('./routes/messages/[message]'))
// Components
import Spinner from './components/Spinner'
// API calls
import { getPostData } from './routes/profile/[profile]/post/[post]' // todo, vite warning
import { getListData } from './routes/profile/[profile]/lists/[list]' // todo, vite warning
import { getListsData } from './routes/profile/[profile]/lists' // todo // vite warning
import { getLikesData } from './routes/profile/[profile]/likes' // todo, vite warning
import getFeed from './api/feed/getFeed'
import searchActors from './api/actor/searchActors'
import searchPosts from './api/feed/searchPosts'
import getProfile from './api/actor/getProfile'
import getAuthorFeed from './api/feed/getAuthorFeed'
import getFollowers from './api/graph/getFollowers'
import getFollows from './api/graph/getFollows'
import getFeedGenerator from './api/feed/getFeedGenerator'
import getPopularTags from './api/custom/getPopularTags'
import listNotifications from './api/notification/listNotifications'

const Root = () => (
	<Suspense fallback={<Spinner />}>
		<MetaProvider>
			<Router root={App}>
				<Route path='/'>
					<Route>
						<Route
							path='/'
							component={session.accessJwt ? Timeline : Discover}
						/>
						<Route
							component={Discover}
							path='/discover'
							preload={() =>
								getFeed({
									feed: 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot',
									limit: 5,
									token: session.accessJwt
								})
							}
						/>
						<Route
							component={Hot}
							path='/hot'
							preload={() =>
								getFeed({
									feed: 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/hot-classic',
									limit: 5,
									token: session.accessJwt
								})
							}
						/>
					</Route>
					<Route path='/live' component={Firehose} />
				</Route>
				<Route path='/search' component={SearchPage}>
					<Route
						path='/'
						component={Top}
						preload={({ location }) => {
							const query =
								new URLSearchParams(
									location.query as unknown as string
								).get('q') ?? ''
							searchActors(query)
							searchPosts({ query, sort: 'top' })
						}}
					/>
					<Route
						path='/latest'
						component={Latest}
						preload={({ location }) =>
							searchPosts({
								query:
									new URLSearchParams(
										location.query as unknown as string
									).get('q') ?? '',
								sort: 'latest'
							})
						}
					/>
					<Route
						path='/people'
						component={People}
						preload={({ location }) =>
							searchActors(
								new URLSearchParams(
									location.query as unknown as string
								).get('q') ?? ''
							)
						}
					/>
					<Route
						path='/media'
						component={MediaSearch}
						preload={({ location }) =>
							searchPosts({
								query:
									new URLSearchParams(
										location.query as unknown as string
									).get('q') ?? '',
								sort: 'top'
							})
						}
					/>
				</Route>
				<Route
					path='/hashtag/:hashtag'
					component={HashtagPage}
					preload={({ params }) =>
						searchPosts({
							query: decodeURIComponent(`#${params.hashtag}`),
							sort: 'top'
						})
					}
				/>
				<Route
					path='/trends'
					component={Trends}
					preload={() => getPopularTags(100)}
				/>

				<Route path='/feeds' component={PopularFeeds} />
				<Route path='/about' component={About} />
				<Route
					path='/notifications'
					component={Notifications}
					preload={() => listNotifications(session.accessJwt)}
				/>
				<Route path='/messages' component={Messages} />
				<Route path='/messages/:message' component={Message} />
				<Route
					path='/profile/:profile'
					component={Profile}
					preload={({ params }) => getProfile(params.profile)}
				>
					<Route
						preload={({ params }) => getAuthorFeed(params.profile)}
					>
						<Route path='/' component={Posts} />
						<Route path='/replies' component={Replies} />
						<Route path='/media' component={Media} />
					</Route>
					<Route
						path='/likes'
						component={Likes}
						preload={({ params }) => getLikesData(params.profile)}
					/>
					<Route
						path='/feed'
						component={UserFeeds}
						preload={({ params }) =>
							getFeed({ feed: params.profile })
						}
					/>
					<Route
						path='/lists'
						component={Lists}
						preload={({ params }) => getListsData(params.profile)}
					/>
					<Route>
						<Route
							component={Followers}
							path='/followers'
							preload={({ params }) =>
								getFollowers(params.profile)
							}
						/>
						<Route
							component={Following}
							path='/following'
							preload={({ params }) => getFollows(params.profile)}
						/>
					</Route>
				</Route>
				<Route
					path='/profile/:profile/post/:post'
					component={Post}
					preload={({ params }) =>
						getPostData({
							profile: params.profile,
							post: params.post
						})
					}
				/>
				<Route
					path='/profile/:profile/feed/:feed'
					component={Feed}
					preload={({ params }) =>
						getFeedGenerator({
							profile: params.profile,
							feed: params.feed
						})
					}
				/>
				<Route
					path='/profile/:profile/lists/:list'
					component={List}
					preload={({ params }) =>
						getListData({
							profile: params.profile,
							list: params.list
						})
					}
				/>
			</Router>
		</MetaProvider>
	</Suspense>
)

render(() => <Root />, document.getElementById('root')!)
