import styles from './Modal.module.css'
import { onMount, type JSXElement, onCleanup } from 'solid-js' // createSignal

const Trigger = (props: { children: JSXElement }) => {
	return (
		<div>
			{props.children}
		</div>
	)
}

const Content = (props: { children: JSXElement }) => {
	
	// const [open, setOpen] = createSignal(false)
	
	let dialog: HTMLDialogElement
	
	// const handleOpen = () => {
	// 	dialog.showModal()
	// 	document.body.style.scrollBehavior = 'none'
	// 	document.body.style.overflow = 'hidden'
	// }
	
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

const Modal = () => {

}

export default Modal