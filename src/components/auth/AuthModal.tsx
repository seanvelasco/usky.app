import { createSignal, onCleanup, onMount } from 'solid-js'
import { action } from '@solidjs/router'
import createSession from '../../api/identity/createSession'
// import { PlusIcon } from '../../assets/PlusIcon'
import styles from './AuthModal.module.css'
import { setSession } from '../../storage/session'

const [identifier, setIdentifier] = createSignal('')
const [password, setPassword] = createSignal('')

// Personal note: && vs ||
// I thought && means both should be true
// But using || results in the corrent behavior

// To-do
// identifier validation: bsky max length and domain validation
// app password validaation: should be app password syntax, disallow main password authentication
const isLoginDisabled = () => !identifier() || !password()

const credentials = () => ({ identifier: identifier(), password: password() })

const authenticate = action(async () => {
	const session = await createSession(credentials())
	if (session) {
		setSession(session)
		setIdentifier('')
		setPassword('')
	}
})

const AuthModal = () => {
	let dialog: HTMLDialogElement

	const handleOpen = () => {
		dialog.showModal()
		document.body.style.scrollBehavior = 'none'
		document.body.style.overflow = 'hidden'
	}

	const handleClose = () => {
		document.body.style.scrollBehavior = 'initial'
		document.body.style.overflow = 'initial'
	}

	const handleOutsideClick = (event: MouseEvent) => {
		if (event.target === dialog) {
			dialog.close()
		}
	}

	onMount(() => {
		window.addEventListener('click', handleOutsideClick)
		dialog!.addEventListener('close', handleClose)
	})

	onCleanup(() => {
		document.removeEventListener('click', handleOutsideClick)
		dialog!.removeEventListener('close', handleClose)
	})

	return (
		<>
			<button class={styles.button} type='button' onClick={handleOpen}>
				Login
			</button>
			<dialog ref={dialog!} class={styles.dialog}>
				<form
					action={authenticate}
					method='post'
					class={styles.content}
				>
					<div class={styles.title}>
						<h3>Login to your account</h3>
					</div>
					<input
						class={styles.input}
						type='text'
						name='handle'
						placeholder='Username or email address'
						required
						onInput={(event) => setIdentifier(event.target.value)}
					/>
					<input
						class={styles.input}
						type='password'
						name='password'
						placeholder='Password'
						required
						onInput={(event) => setPassword(event.target.value)}
					/>
					<button
						class={`${styles.input} ${styles.submit}`}
						disabled={isLoginDisabled()}
						type='submit'
					>
						Submit
					</button>
					<div class={styles.alternate}>
						<button type='button'>Create an account</button>
					</div>
				</form>
			</dialog>
		</>
	)
}

export default AuthModal
