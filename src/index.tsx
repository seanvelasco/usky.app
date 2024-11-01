import { MetaProvider } from '@solidjs/meta'
import { Router, Route } from '@solidjs/router'
import { render } from 'solid-js/web'
/* @refresh reload */
import App from './App'
import { lazy, Suspense } from 'solid-js'
import Discover from './routes'
import PopularFeeds from './routes/feeds'
import SearchPage, { HashtagPage } from './routes/search'
import About from './routes/about'
const Firehose = lazy(() => import('./routes/live'))
import Profile from './routes/profile/[profile]'
import { Posts } from './routes/profile/[profile]'
import Replies from './routes/profile/[profile]/replies'
import Likes, { getLikesData } from './routes/profile/[profile]/likes'
import Media from './routes/profile/[profile]/media'
import UserFeeds from './routes/profile/[profile]/feed'
import Lists, { getListsData } from './routes/profile/[profile]/lists'
import Following from './routes/profile/[profile]/following'
import Followers from './routes/profile/[profile]/followers'
import Post, { getPostData } from './routes/profile/[profile]/post/[post]'
import Feed from './routes/profile/[profile]/feed/[feed]'
import List, { getListData } from './routes/profile/[profile]/lists/[list]'
import { Top, People, Latest, Media as MediaSearch } from './routes/search'
import Trends, { getTranding } from './routes/trends'
import Spinner from './components/Spinner'
import Notifications, { getNotifications } from './routes/notifications'
import Login from './routes/(auth)/login'
import Messages from './routes/messages'
import Message from './routes/messages/[message]'
import { session } from './storage/session'
import getFeed from './api/feed/getFeed.ts'
import searchActors from './api/actor/searchActors.ts'
import searchPosts from './api/feed/searchPosts.ts'
import getProfile from './api/actor/getProfile.ts'
import getAuthorFeed from './api/feed/getAuthorFeed.ts'
import getFollowers from './api/graph/getFollowers.ts'
import getFollows from './api/graph/getFollows.ts'
import getFeedGenerator from './api/feed/getFeedGenerator.ts'

const Root = () => (
	<Suspense fallback={<Spinner />}>
		<MetaProvider>
			<Router root={App}>
				<Route path='/login' component={Login} />
				<Route path='/'>
					<Route component={Discover}>
						<Route
							path='/'
							preload={() =>
								getFeed(
									'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot'
								)
							}
						/>
						<Route
							path='/hot'
							preload={() =>
								getFeed(
									'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/hot-classic'
								)
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
								new URLSearchParams(location.query).get('q') ??
								''
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
									new URLSearchParams(location.query).get(
										'q'
									) ?? '',
								sort: 'latest'
							})
						}
					/>
					<Route
						path='/people'
						component={People}
						preload={({ location }) =>
							searchActors(
								new URLSearchParams(location.query).get('q') ??
									''
							)
						}
					/>
					<Route
						path='/media'
						component={MediaSearch}
						preload={({ location }) =>
							searchPosts({
								query:
									new URLSearchParams(location.query).get(
										'q'
									) ?? '',
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
					preload={() => getTranding(100)}
				/>

				<Route path='/feeds' component={PopularFeeds} />
				<Route path='/about' component={About} />
				<Route
					path='/notifications'
					component={Notifications}
					preload={() => getNotifications(session.accessJwt)}
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
						preload={({ params }) => getFeed(params.profile)}
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
