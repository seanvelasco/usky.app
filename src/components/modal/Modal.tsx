import { createSignal, type JSXElement, onCleanup, onMount } from 'solid-js'
import Content from './Content'
import Trigger from './Trigger'
import { DialogContext } from './context'

const Root = (props: { children: JSXElement }) => {
	
	const [open, setOpen] = createSignal(false)
	
	const context = {
		toggle: () => setOpen((prev) => !prev),
		open: open()
	}
	
	onMount(() => {
	
	})
	
	onCleanup(() => {
	
	})
	
	return (
		<DialogContext.Provider value={context}>
			{props.children}
		</DialogContext.Provider>
	)
}

const Modal = Object.assign(Root, {
	Content,
	Trigger
})

export default Modal