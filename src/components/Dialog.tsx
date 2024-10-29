import {
	createContext,
	createEffect,
	createSignal,
	onCleanup,
	onMount,
	useContext,
	type JSXElement
} from 'solid-js'
import styles from './Dialog.module.css'

interface DialogContextValue {
	toggle: () => void
	open: () => boolean
}

const DialogContext = createContext<DialogContextValue>()

const useDialogContext = () => {
	const context = useContext(DialogContext)
	if (!context) {
		throw new Error('useDialogContext')
	}
	return context
}

const Trigger = (props: { children: JSXElement }) => {
	const context = useDialogContext()
	return <button onClick={context.toggle}>{props.children}</button>
}

const Content = (props: { children: JSXElement }) => {
	const context = useDialogContext()
	let dialog: HTMLDialogElement

	createEffect(() => {
		console.log(context.open())
		if (context.open()) {
			handleOpen()
		} else {
			handleClose()
		}
	})

	const handleOpen = () => {
		dialog.showModal()
		document.body.style.overflow = 'hidden'
	}

	const handleClose = () => {
		dialog.close()
		document.body.style.overflow = 'initial'
	}

	const handleOutsideClick = (event: MouseEvent) => {
		if (event.target === dialog) context.toggle()
	}

	onMount(() => {
		dialog.addEventListener('click', handleOutsideClick)
		dialog.addEventListener('close', handleClose)
	})

	onCleanup(() => {
		dialog.removeEventListener('click', handleOutsideClick)
		dialog.removeEventListener('close', handleClose)
	})

	return (
		<dialog ref={dialog!} class={styles.dialog}>
			<div class={styles.content}>{props.children}</div>
		</dialog>
	)
}

const Root = (props: { children: JSXElement }) => {
	const [open, setOpen] = createSignal(false)

	const context = {
		toggle: () => setOpen((prev) => !prev),
		open
	}

	return (
		<DialogContext.Provider value={context}>
			{props.children}
		</DialogContext.Provider>
	)
}

const Dialog = Object.assign(Root, {
	Content,
	Trigger
})

export default Dialog
