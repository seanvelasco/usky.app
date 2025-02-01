import { Show } from 'solid-js'

export const HomeIcon = (props: { filled?: boolean }) => {
	return (
		<svg
			width='1.75rem'
			height='1.75rem'
			fill='none'
			viewBox='0 0 28 28'
			xmlns='http://www.w3.org/2000/svg'
		>
			<Show
				when={props.filled}
				fallback={
					<path
						fill-rule='evenodd'
						clip-rule='evenodd'
						d='M21.25 23H15.5v-5.75a.25.25 0 00-.25-.25h-2.5a.25.25 0 00-.25.25V23H6.75A1.75 1.75 0 015 21.25v-7.894c0-.94.429-1.83 1.172-2.436l6.838-5.57a1.577 1.577 0 011.98 0l6.838 5.57A3.144 3.144 0 0123 13.356v7.894A1.75 1.75 0 0121.25 23zM14 6.5a.066.066 0 00-.042.012l-6.839 5.57c-.401.328-.619.796-.619 1.274v7.894c0 .138.112.25.25.25H11v-4.25c0-.966.784-1.75 1.75-1.75h2.5c.966 0 1.75.784 1.75 1.75v4.25h4.25a.25.25 0 00.25-.25v-7.894c0-.478-.218-.946-.62-1.273l-6.838-5.57A.066.066 0 0014 6.5z'
						fill='#bbb'
					></path>
				}
			>
				<path
					fill-rule='evenodd'
					clip-rule='evenodd'
					d='M21.25 23H16v-5.75a1 1 0 00-1-1h-2a1 1 0 00-1 1V23H6.75A1.75 1.75 0 015 21.25v-7.894c0-.94.429-1.83 1.172-2.436l6.838-5.57a1.577 1.577 0 011.98 0l6.838 5.57A3.144 3.144 0 0123 13.356v7.894A1.75 1.75 0 0121.25 23z'
					fill='var(--icon)'
				></path>
			</Show>
		</svg>
	)
}
