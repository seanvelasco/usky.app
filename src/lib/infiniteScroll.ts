// const [posts, setPosts] = createSignal<t>([])
// 	const [cursor, setCursor] = createSignal('')
// 	const [isLoading, setIsLoading] = createSignal(false)
// 	const [end, setEnd] = createSignal(false)

// 	const io = new IntersectionObserver((entry) => {
// 		if (entry.length && entry[0].isIntersecting) {
// 			setCursor(response()?.cursor as string)
// 		}
// 	})

// 	onCleanup(() => io.disconnect())

// 	const setRef = (element: Element) => {
// 		io.observe(element)
// 	}

// 	const response = createAsync(() =>
// 		getFeed(
// 			'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot',
// 			5,
// 			cursor()
// 		)
// 	)

// 	createEffect(() => {
// 		if (response()?.feed) {
// 			batch(() => {
// 				setPosts((prev) => [...prev, ...(response()?.feed as t)])
// 			})
// 		}
// 	})
