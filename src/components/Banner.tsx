import Button from './Button'
import styles from './Banner.module.css'

// const Logo = () => (
// 	<svg width="2.5rem" height="2.5rem" xmlns="http://www.w3.org/2000/svg" fill="url(#whiteGradient)" viewBox="0 0 24 24" stroke-width="1.5"
// 	     stroke="url(#whiteGradient)">
// 		<defs>
// 			<linearGradient id="whiteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
// 				<stop offset="0%" style="stop-color:white;stop-opacity:1" />
// 				<stop offset="100%" style="stop-color:#f0f0f0;stop-opacity:1" />
// 			</linearGradient>
// 		</defs>
// 		<path stroke-linecap="round" stroke-linejoin="round"
// 		      d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
// 	</svg>
// )

const Banner = () => {
	return <div class={styles.banner}>
		<div class={styles.content}>
			<p>See what's happening, discover new things, and find your people</p>
			<Button style={{
				'background-color': "#e0e0e0",
				color: '#111'
			}}>Login</Button>
		</div>
	</div>
}

export default Banner