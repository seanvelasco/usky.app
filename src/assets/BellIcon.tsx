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
					fill-rule='evenodd'
					clip-rule='evenodd'
					d='M6.421 12.579C6.842 7.947 9.814 5 14 5s7.158 2.947 7.579 7.579L22 20h-4.76a3.25 3.25 0 01-6.48 0H6l.421-7.421zM12.268 20a1.75 1.75 0 003.464 0h-3.464z'
					fill='var(--icon)'
				></path>
			}
		>
			<path
				fill-rule='evenodd'
				clip-rule='evenodd'
				d='M22 20l-.421-7.421C21.158 7.947 18.186 5 14 5s-7.158 2.947-7.579 7.579L6 20h4.76a3.25 3.25 0 006.48 0H22zM7.588 18.5l.33-5.81c.187-2.016.916-3.553 1.94-4.575C10.878 7.098 12.277 6.5 14 6.5c1.723 0 3.123.598 4.142 1.615 1.024 1.022 1.753 2.559 1.94 4.575l.33 5.81H7.589zm8.144 1.5h-3.464a1.75 1.75 0 003.464 0z'
				fill='var(--icon)'
			></path>
		</Show>
	</svg>
)
