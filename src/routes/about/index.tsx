import styles from "./styles.module.css"

const About = () => {
	return (
		<div class={styles.about}>
			<img src="/usky.svg" />
			<h3>About usky.app</h3>
			<p>
				usky.app is a lightweight (29.91 kB gzipped) and minimalist web
				client for the decentralized social network, Bluesky.
			</p>
			<p>
				usky.app allows you to see what's happening in Bluesky, join the
				conversation, discover new things, and look up people you know.
			</p>
			<h3>History</h3>
			<p>
				Having no Twitter account (I only have Facebook), I painfully
				learned there are numerous parts of what makes a post. I
				thought,{" "}
				<i>
					"is this post an original post or a repost, is this a parent
					post or a reply post, how many replies does this have, does
					this have an embed, how many types of embeds are there, how
					do I check if this post is NSFW or deleted."
				</i>
			</p>
			<p>
				What started out as a humble side project became a frontend
				experiment of figuring out how to piece together posts to form a
				thread or a feed. The end result is this app. 😁
			</p>
			<h3>
				Why the name <i>usky.app</i>?
			</h3>
			<p>There are three reasons why it's called usky.app.</p>
			<ol>
				<li>
					It's a tiny, minimalist, and lightweight client for Bluesky.
					So it's like, µBluesky.
				</li>
				<li>
					If someone wants to view a Bluesky profile or post, but they
					don't have an account yet, they can easily preview the
					content by changing just one character in the URL - change{" "}
					<i>b</i>sky.app to <i>u</i>sky.app .
				</li>
				<li>All the good domain names are taken. 😔</li>
			</ol>
			<p></p>
			<h3>Stack</h3>
			<p>
				usky.app is a statically exported Solid.js SPA and PWA
				(previously a server-rendered SvelteKit app). Uses CSS modules
				for styling. Has two external dependencies: solid-router and
				solid-meta. All icons are from Heroicons (including app logo).
			</p>
			<p>The whole app is open-source. Please feel free to contribute!</p>
		</div>
	)
}

export default About
