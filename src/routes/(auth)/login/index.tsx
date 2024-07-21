import { createSignal } from 'solid-js'
import { useAction } from '@solidjs/router'
import createSession from '../../../api/identity/createSession'
import { useSession, login } from '../../../states/session'
import styles from './styles.module.css'

const Login = () => {
	const [identifier, setIdentifier] = createSignal('')
	const [password, setPassword] = createSignal('')

	const disabled = () => !identifier() || !password()

	return (
		<div class={styles.dialog}>
			<form action={login} method='post' class={styles.content}>
				<input
					class={styles.input}
					type='text'
					name='identifier'
					placeholder='Username or email address'
					required
					value={identifier()}
					onInput={(event) => setIdentifier(event.target.value)}
				/>
				<input
					class={styles.input}
					type='password'
					name='password'
					placeholder='Password'
					required
					value={password()}
					onInput={(event) => setPassword(event.target.value)}
				/>
				<button
					class={`${styles.input} ${styles.submit}`}
					disabled={disabled()}
					type='submit'
				>
					Submit
				</button>
			</form>
		</div>
	)
}

export default Login
