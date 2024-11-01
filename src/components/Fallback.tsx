import styles from './Fallback.module.css'

const Fallback = (props: { err: any; reset: () => void }) => (
	<div class={styles.container}>
		<svg
			class={styles.icon}
			width='3.5rem'
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='currentColor'
		>
			<path
				fill-rule='evenodd'
				d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z'
				clip-rule='evenodd'
			/>
		</svg>
		<h1 class={styles.heading}>An error occurred</h1>
		{/*<p>{props.err.message}</p>*/}
		<button class={styles.button} onClick={props.reset}>
			Try Again
		</button>
	</div>
)

export default Fallback
