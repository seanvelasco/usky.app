import { createSignal, onCleanup } from 'solid-js'
import type { JSXElement } from 'solid-js'
import styles from './Dropdown.module.css'

const [isOpen, setOpen] = createSignal(false)

const Container = (props: { children: JSXElement }) => {
	return <div class={styles.container}>{props.children}</div>
}

const Content = (props: { children: JSXElement }) => {
	onCleanup(() => setOpen(false))

	return (
		<menu
			class={styles.content}
			style={{
				display: isOpen() ? 'block' : 'none'
			}}
		>
			<ul>{props.children}</ul>
		</menu>
	)
}

const Trigger = (props: { children: JSXElement }) => {
	return <button onclick={() => setOpen(!isOpen())}>{props.children}</button>
}

const Item = (props: { children: JSXElement }) => {
	return <li>{props.children}</li>
}

const Dropdown = {
	Container,
	Content,
	Trigger,
	Item
}

export default Dropdown
