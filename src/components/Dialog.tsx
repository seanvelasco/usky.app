// import { createSignal, Show, type JSX } from "solid-js"

// type ModalProps = {
// 	children: JSX.Element
// }

// const Modal = (props: ModalProps) => {
// 	const [open, setOpen] = createSignal(false)

// 	return (
// 		<>
// 			<button onClick={() => setOpen(true)}></button>

// 			<Show when={open()}>
// 				<div role="presentation">
// 					<section role="dialog">{props.children}</section>
// 				</div>
// 			</Show>
// 		</>
// 	)
// }
