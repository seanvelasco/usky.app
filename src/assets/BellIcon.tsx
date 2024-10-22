import { Show } from 'solid-js'

// export const BellIcon = () => (
// 		<svg
// 			width='1.5rem'
// 			height='1.5rem'
// 			xmlns='http://www.w3.org/2000/svg'
// 			fill='none'
// 			viewBox='0 0 24 24'
// 			stroke-width='1.5'
// 			stroke='currentColor'
// 		>
// 			<path
// 				stroke-linecap='round'
// 				stroke-linejoin='round'
// 				d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0'
// 			/>
// 		</svg>
// 	)

export const BellIcon = (props: { filled?: Boolean }) => (
	<svg
		width='1.5rem'
		height='1.5rem'
		fill='none'
		viewBox='0 0 24 24'
		xmlns='http://www.w3.org/2000/svg'
	>
		<Show
			when={props.filled}
			fallback={
				<path
					d='M12 1.996a7.49 7.49 0 0 1 7.496 7.25l.004.25v4.097l1.38 3.156a1.25 1.25 0 0 1-1.145 1.75L15 18.502a3 3 0 0 1-5.995.177L9 18.499H4.275a1.251 1.251 0 0 1-1.147-1.747L4.5 13.594V9.496c0-4.155 3.352-7.5 7.5-7.5ZM13.5 18.5l-3 .002a1.5 1.5 0 0 0 2.993.145l.006-.147ZM12 3.496c-3.32 0-6 2.674-6 6v4.41L4.656 17h14.697L18 13.907V9.509l-.004-.225A5.988 5.988 0 0 0 12 3.496Z'
					fill='currentColor'
				/>
			}
		>
			<path
				d='M9.042 19.003h5.916a3 3 0 0 1-5.916 0Zm2.958-17a7.5 7.5 0 0 1 7.5 7.5v4l1.418 3.16A.95.95 0 0 1 20.052 18h-16.1a.95.95 0 0 1-.867-1.338l1.415-3.16V9.49l.005-.25A7.5 7.5 0 0 1 12 2.004Z'
				fill='currentColor'
			/>
		</Show>
	</svg>
)
