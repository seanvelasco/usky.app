import { Show } from 'solid-js'
// import { useSession } from '../states/session'
import AuthModal from './auth/AuthModal'
import styles from './Banner.module.css'
import { session } from '../storage/session'

const Banner = () => {
	// todo: prob is useSession().session is not reactive whereas storageSession.session is reactive
	// const session = useSession()
	return (
		<Show when={!session.did}>
			<div class={styles.banner}>
				<div class={styles.content}>
					<p>
						See what's happening, discover new things, and find your
						people
					</p>
					<AuthModal />
				</div>
			</div>
		</Show>
	)
}

export default Banner
