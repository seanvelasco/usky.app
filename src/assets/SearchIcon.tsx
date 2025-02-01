import { Show } from 'solid-js'

export const SearchIcon = (props: { filled?: boolean }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 28 28'
			// stroke-width='1.5'
			width='1.75rem'
			height='1.75rem'
		>
			<Show
				when={props.filled}
				fallback={
					<path
						fill-rule='evenodd'
						clip-rule='evenodd'
						d='M19.084 7.416a8.25 8.25 0 10-.555 12.174L21.94 23A.75.75 0 1023 21.94l-3.409-3.41a8.25 8.25 0 00-.506-11.114zM8.477 8.477a6.75 6.75 0 119.546 9.546 6.75 6.75 0 01-9.546-9.546z'
						fill='#bbb'
					></path>
				}
			>
				<path
					fill-rule='evenodd'
					clip-rule='evenodd'
					d='M19.084 7.416a8.25 8.25 0 10-.555 12.174L21.94 23A.75.75 0 1023 21.94l-3.409-3.41a8.25 8.25 0 00-.506-11.114zM8.477 8.477a6.75 6.75 0 119.546 9.546 6.75 6.75 0 01-9.546-9.546z'
					fill='#bbb'
				></path>
			</Show>
		</svg>
	)
}
