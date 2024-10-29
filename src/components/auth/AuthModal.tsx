import { createSignal } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { action } from '@solidjs/router'
import Dialog from '../Dialog'
import Button from '../Button'
import createSession from '../../api/identity/createSession'
import createAccount from '../../api/server/createAccount'
import { setSession } from '../../storage/session'
import { DEFAULT_PROVIDER } from '../../constants'
import styles from './AuthModal.module.css'

const [selected, setSelected] = createSignal<'login' | 'register'>('login')
// Only contains letters, numbers, and hyphens
// At least 3 characters
// need to resolve handle first

const Register = () => {
	const [provider, setProvider] = createSignal(DEFAULT_PROVIDER)
	const [email, setEmail] = createSignal('')
	const [handle, setHandle] = createSignal('')
	const [password, setPassword] = createSignal('')
	const [birthdate, setBirthdate] = createSignal('')

	const isSubmitDisabled = () =>
		!provider() || !email() || !handle() || !password() || !birthdate()

	const credentials = () => ({
		email: email(),
		handle: handle(),
		password: password(),
		inviteCode: '',
		verificationCode: ''
	})

	const register = action(async () => {
		const session = await createAccount(credentials())
		if (session) {
			setSession(session)
			setEmail('')
			setHandle('')
			setPassword('')
			setBirthdate('')
		}
	})

	return (
		<form action={register} method='post' class={styles.content}>
			<div class={styles.title}>
				<h3>Create an account</h3>
			</div>
			<label>Server</label>
			<input
				class={styles.input}
				type='text'
				name='provider'
				placeholder='bsky.social'
				required={true}
				value={provider()}
				disabled={true}
				onInput={(event) => setProvider(event.target.value)}
			/>
			<label>Email</label>
			<input
				autofocus={true}
				class={styles.input}
				type='email'
				name='email'
				placeholder='Enter your email address'
				required={true}
				value={email()}
				onInput={(event) => setEmail(event.target.value)}
			/>
			<label>Username</label>
			<input
				autofocus={true}
				class={styles.input}
				type='text'
				name='username'
				placeholder='Enter your desired username'
				required={true}
				value={handle()}
				onInput={(event) => setHandle(event.target.value)}
			/>
			<label>Password</label>
			<input
				class={styles.input}
				type='password'
				name='password'
				placeholder='Choose your password'
				required={true}
				value={password()}
				onInput={(event) => setPassword(event.target.value)}
			/>
			<label>Birthdate</label>
			<input
				class={styles.input}
				type='date'
				name='birth'
				placeholder='Birthdate'
				required={true}
				value={birthdate()}
				onInput={(event) => setBirthdate(event.target.value)}
			/>
			<div class={styles.controls}>
				<button
					onClick={() => setSelected('login')}
					style={{
						'background-color': 'transparent',
						'font-weight': 'normal'
					}}
					class={styles.submit}
				>
					I already have an account
				</button>
				<button
					class={styles.submit}
					disabled={true && isSubmitDisabled()}
					type='submit'
				>
					Register
				</button>
			</div>
		</form>
	)
}

const Login = () => {
	const [provider, setProvider] = createSignal(DEFAULT_PROVIDER)
	const [identifier, setIdentifier] = createSignal('')
	const [password, setPassword] = createSignal('')
	// identifier validation: bsky max length and domain validation
	// app password validaation: should be app password syntax, disallow main password authentication
	const isLoginDisabled = () => !provider() || !identifier() || !password()

	const credentials = () => ({
		identifier: identifier(),
		password: password()
	})

	const authenticate = action(async () => {
		const session = await createSession(credentials())
		if (session) {
			setSession({ ...session })
			setIdentifier('')
			setPassword('')
		}
	})

	return (
		<form action={authenticate} method='post' class={styles.content}>
			<div class={styles.title}>
				<h3>Login to your account</h3>
			</div>
			<label>Server</label>
			<input
				class={styles.input}
				type='text'
				name='provider'
				placeholder='bsky.social'
				required={true}
				value={provider()}
				disabled={true}
				onInput={(event) => setProvider(event.target.value)}
			/>
			<label>Account</label>
			<input
				autofocus={true}
				class={styles.input}
				type='text'
				name='handle'
				placeholder='Username or email address'
				required={true}
				value={identifier()}
				onInput={(event) => setIdentifier(event.target.value)}
			/>
			<input
				class={styles.input}
				type='password'
				name='password'
				placeholder='Password'
				required={true}
				value={password()}
				onInput={(event) => setPassword(event.target.value)}
			/>
			<div class={styles.controls}>
				<button
					onClick={() => setSelected('register')}
					style={{
						'background-color': 'transparent',
						'font-weight': 'normal'
					}}
					class={styles.submit}
				>
					Create an account
				</button>
				<button
					class={styles.submit}
					disabled={isLoginDisabled()}
					type='submit'
				>
					Submit
				</button>
			</div>
		</form>
	)
}

const options = {
	login: Login,
	register: Register
}

const AuthModal = () => (
	<Dialog>
		<Dialog.Trigger>
			<Button
				style={{
					'background-color': '#e0e0e0',
					color: '#111'
				}}
			>
				Login
			</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dynamic component={options[selected()]} />
		</Dialog.Content>
	</Dialog>
)

export default AuthModal
