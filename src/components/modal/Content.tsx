import { onCleanup, onMount, type JSXElement, createEffect } from 'solid-js'
import useDialogContext from './context'
import styles from './Modal.module.css'

const Content = (props: { children: JSXElement }) => {
	const { open } = useDialogContext()

	let dialog: HTMLDialogElement

	createEffect(() => {
		if (open) {
			handleOpen()
		} else {
			handleClose()
		}
	})

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
		<dialog ref={dialog!} class={styles.dialog}>
			{props.children}
		</dialog>
	)
}

export default Content
