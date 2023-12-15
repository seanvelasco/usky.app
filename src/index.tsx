/* @refresh reload */
import App from "./App"
import { ErrorBoundary, render } from "solid-js/web"
import { MetaProvider } from "@solidjs/meta"
import { Router } from "@solidjs/router"

const root = document.getElementById("root")

render(
	() => (
		<Router>
			<MetaProvider>
				<ErrorBoundary
					fallback={(error) => (
						<div>
							<code>Error occured: {error?.message}</code>
						</div>
					)}
				>
					<App />
				</ErrorBoundary>
			</MetaProvider>
		</Router>
	),
	root!
)
