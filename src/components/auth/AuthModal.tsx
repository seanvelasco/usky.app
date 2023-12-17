import { createSignal, createResource, onMount, onCleanup } from "solid-js"
import createSession from "../../api/identity/createSession"
import { PlusIcon } from "../../assets/PlusIcon"
import styles from "./AuthModal.module.css"
// import { cookieStorage, makePersisted } from "@solid-primitives/storage"

const [identifier, setIdentifier] = createSignal("")
const [password, setPassword] = createSignal("")

const credentials = () => {
	return { identifier: identifier(), password: password() }
}

const handleLogin = (event: Event) => {
	console.log(event.preventDefault())
	console.log(credentials())
	const [session] = createResource(credentials(), createSession)

	// const session = await createSession(credentials())

	// const [signal, setSignal] = makePersisted(createSignal())

	if (session.error) {
		return
	}

	// if (session()) {
	// 	cookieStorage.setItem("accessJwt", session().accessJwt)
	// 	cookieStorage.setItem("refreshJwt", session().refreshJwt)
	// }
}

const AuthModal = () => {
	let dialog: HTMLDialogElement | undefined

	const handleOpen = () => {
		dialog?.showModal()
		document.body.style.scrollBehavior = "none"
		document.body.style.overflow = "hidden"
	}

	const handleClose = () => {
		document.body.style.scrollBehavior = "initial"
		document.body.style.overflow = "initial"
	}

	const handleOutsideClick = (event: MouseEvent) => {
		if (event.target === dialog) {
			dialog?.close()
		}
	}

	onMount(() => {
		window.addEventListener("click", handleOutsideClick)
		dialog!.addEventListener("close", handleClose)
	})

	onCleanup(() => {
		document.removeEventListener("click", handleOutsideClick)
		dialog!.removeEventListener("close", handleClose)
	})

	return (
		<>
			<button onClick={handleOpen}>
				<PlusIcon />
			</button>
			<dialog ref={dialog} class={styles.dialog}>
				<form class={styles.content} onsubmit={handleLogin}>
					<p>Login to your account 👋</p>
					<input
						class={styles.input}
						type="text"
						name="handle"
						placeholder="Handle or DID"
						required
						onInput={(event) => setIdentifier(event.target.value)}
					/>
					<input
						class={styles.input}
						type="passport"
						name="password"
						placeholder="App passowrd"
						required
						onInput={(event) => setPassword(event.target.value)}
					/>
					<button class={styles.input} type="submit">
						Submit
					</button>
					<a>Create an account</a>
				</form>
			</dialog>
		</>
	)
}

export default AuthModal
