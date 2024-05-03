import { Show } from 'solid-js'
import {
	A,
	useNavigate,
	useLocation,
	type RouteSectionProps
} from '@solidjs/router'
import { ChevronLeft } from '../../assets/ChevronLeft'

export const ProfilePageHeader = () => {
	// const profile = useRouteData<typeof ProfileData>()
	// return <p>{profile()?.displayName ?? profile()?.handle} </p>
	return <p></p>
}

export const TimelineHeader = () => {
	return (
		<div
			style={{
				display: 'flex',
				width: '100%',
				gap: '1rem',
				'font-weight': 500,
				padding: '0 1rem'
			}}
		>
			<A
				activeClass='highlight'
				end
				style={{
					color: 'var(--text-secondary)',
					flex: 1,
					'text-align': 'center'
				}}
				href='/'
			>
				Discover
			</A>
			<A
				activeClass='highlight'
				end
				style={{
					color: 'var(--text-secondary)',
					flex: 1,
					'text-align': 'center'
				}}
				href='/hot'
			>
				What's Hot
			</A>
			<A
				activeClass='highlight'
				style={{
					color: 'var(--text-secondary)',
					flex: 1,
					'text-align': 'center'
				}}
				end
				href='/live'
			>
				Live
			</A>
		</div>
	)
}

// const FeedHeader = () => {
// 	const feedGenerator = useRouteData<typeof FeedData>()
// 	return (
// 		<Suspense>
// 			<p>
// 				{feedGenerator()?.view.displayName}{' '}
// 				<span
// 					style={{
// 						color: 'var(--text-secondary)'
// 					}}
// 				>
// 					by{' '}
// 					<a
// 						style={{
// 							color: 'inherit'
// 						}}
// 						href={`/profile/${
// 							feedGenerator()?.view?.creator?.handle
// 						}`}
// 					>
// 						@{feedGenerator()?.view?.creator?.handle}
// 					</a>
// 				</span>
// 			</p>
// 		</Suspense>
// 	)
// }

const Header = (props: RouteSectionProps) => {
	const navigate = useNavigate()
	const location = useLocation()

	const isHome = () => ['/', '/hot', '/live'].includes(location.pathname)

	return (
		<header
			style={{
				position: 'sticky',
				top: 0,
				'background-color': 'var(--background-primary)',
				'border-bottom': ' 1px solid var(--border)',

				'z-index': 2,
				padding: ' 0 1.5rem'
			}}
		>
			<div
				style={{
					display: 'flex',
					'align-items': 'center',
					height: '3.25rem',
					gap: '1rem'
				}}
			>
				<Show when={history && !isHome()}>
					<button
						style={{
							all: 'unset',
							display: 'flex'
						}}
						onClick={() => navigate(-1)}
					>
						<ChevronLeft />
					</button>
				</Show>
				{props.children}
				{/*<Router>*/}
				{/*	<Route*/}
				{/*		path={['/', 'hot', '/live']}*/}
				{/*		component={TimelineHeader}*/}
				{/*	/>*/}
				{/*	<Route path='/search' component={Search} />*/}
				{/*	<Route*/}
				{/*		path='/profile/:profile/*'*/}
				{/*		component={ProfilePageHeader}*/}
				{/*		load={ProfileData}*/}
				{/*	/>*/}
				{/*	<Route*/}
				{/*		path='/profile/:profile/feed/:feed'*/}
				{/*		component={FeedHeader}*/}
				{/*		load={FeedData}*/}
				{/*	/>*/}
				{/*	<Route path='/profile/:profile/list/:list' />*/}
				{/*	<Route*/}
				{/*		path='/profile/:profile/post/:post'*/}
				{/*		load={ProfileData}*/}
				{/*	>*/}
				{/*		<p>Post</p>*/}
				{/*	</Route>*/}
				{/*</Router>*/}
			</div>
		</header>
	)
}

export default Header
