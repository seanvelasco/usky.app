import { Show } from 'solid-js'

export const BubbleIcon = (props: { filled?: boolean }) => (
	<svg
		width='1.75rem'
		height='1.75rem'
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 28 28'
		stroke-width='1.5'
		stroke='currentColor'
	>
		<Show
			when={props.filled}
			fallback={
				<>
					<path
						fill-rule='evenodd'
						clip-rule='evenodd'
						d='M20.608 3.463c1.204-.794 2.798.126 2.711 1.565l-1.09 18.154c-.089 1.493-1.888 2.193-2.963 1.153l-5.667-5.48a.25.25 0 00-.105-.06l-7.58-2.168c-1.437-.412-1.73-2.32-.483-3.143l15.177-10.02zm1.214 1.476a.25.25 0 00-.387-.224L6.258 14.735a.25.25 0 00.069.45l7.58 2.168c.276.079.528.224.735.424l5.667 5.48a.25.25 0 00.423-.165l1.09-18.153z'
						fill='#bbb'
					></path>
					<path
						fill-rule='evenodd'
						clip-rule='evenodd'
						d='M20.19 7.317l-5.383 11.325-1.732-1L20.19 7.317z'
						fill='#bbb'
					></path>
				</>
			}
		>
			<path
				fill-rule='evenodd'
				clip-rule='evenodd'
				d='M23.319 5.028c.087-1.439-1.507-2.359-2.711-1.565L5.43 13.484c-1.247.823-.954 2.731.483 3.143l6.58 1.882L20.189 7.32l-5.842 12.257 4.92 4.758c1.075 1.04 2.874.34 2.963-1.153l1.09-18.154z'
				fill='var(--icon)'
			></path>
		</Show>
	</svg>
)

export default BubbleIcon
