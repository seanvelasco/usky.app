import { MetaProvider } from '@solidjs/meta'
import { Router, Route } from '@solidjs/router'
import { render } from 'solid-js/web'
/* @refresh reload */
import App from './App'
import { lazy } from 'solid-js'
// HOME
import Discover, { getDiscoveryFeed } from './routes'
import PopularFeeds from './routes/feeds'
import SearchPage, { HashtagPage, postSearch } from './routes/search'
import About from './routes/about'
// LIVE
const Firehose = lazy(() => import('./routes/live'))
// PROFILE
import Profile, { getProfileData } from './routes/profile/[profile]'
import { Posts, getPostsData } from './routes/profile/[profile]'
import Replies from './routes/profile/[profile]/replies'
import Likes, { getLikesData } from './routes/profile/[profile]/likes'
import Media from './routes/profile/[profile]/media'
import UserFeeds, { getFeedsData } from './routes/profile/[profile]/feed'
import Lists, { getListsData } from './routes/profile/[profile]/lists'
import Following, { getFollowsData } from './routes/profile/[profile]/following'
import Followers, {
	getFollowersData
} from './routes/profile/[profile]/followers'
// POST
import Post, { getPostData } from './routes/profile/[profile]/post/[post]'
// FEED
import Feed, { feedGeneratorData } from './routes/profile/[profile]/feed/[feed]'
// LIST
import List, { getListData } from './routes/profile/[profile]/lists/[list]'
// to-do: loaders should be in a separate file

render(
	() => (
		<MetaProvider>
			<Router root={App}>
				<Route component={Discover}>
					<Route
						path='/'
						load={() =>
							getDiscoveryFeed(
								'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot'
							)
						}
					/>
					<Route
						path='/hot'
						load={() =>
							getDiscoveryFeed(
								'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/hot-classic'
							)
						}
					/>
				</Route>
				<Route path='/live' component={Firehose} />
				<Route path='/search' component={SearchPage}>
					<Route path="/" />
					<Route path="/latest" />
					<Route path="/people" />
				</Route>
				<Route path='/hashtag/:hashtag' component={HashtagPage} load={({ params }) => postSearch(params.hashtag)} />
				<Route path='/feeds' component={PopularFeeds} />
				<Route path='/about' component={About} />
				<Route
					path='/profile/:profile'
					component={Profile}
					load={({ params }) => getProfileData(params.profile)}
				>
					<Route load={({ params }) => getPostsData(params.profile)}>
						<Route path='/' component={Posts} />
						<Route path='/replies' component={Replies} />
						<Route path='/media' component={Media} />
					</Route>
					<Route
						path='/likes'
						component={Likes}
						load={({ params }) => getLikesData(params.profile)}
					/>
					<Route
						path='/feed'
						component={UserFeeds}
						load={({ params }) => getFeedsData(params.profile)}
					/>
					<Route
						path='/lists'
						component={Lists}
						load={({ params }) => getListsData(params.profile)}
					/>
					<Route>
						<Route
							component={Followers}
							path='/followers'
							load={({ params }) =>
								getFollowersData(params.profile)
							}
						/>
						<Route
							component={Following}
							path='/following'
							load={({ params }) =>
								getFollowsData(params.profile)
							}
						/>
					</Route>
				</Route>
				<Route
					path='/profile/:profile/post/:post'
					component={Post}
					load={({ params }) =>
						getPostData({
							profile: params.profile,
							post: params.post
						})
					}
				/>
				<Route
					path='/profile/:profile/feed/:feed'
					component={Feed}
					load={({ params }) =>
						feedGeneratorData({
							profile: params.profile,
							feed: params.feed
						})
					}
				/>
				<Route
					path='/profile/:profile/lists/:list'
					component={List}
					load={({ params }) =>
						getListData({
							profile: params.profile,
							list: params.list
						})
					}
				/>
			</Router>
		</MetaProvider>
	),
	document.getElementById('root')!
)
