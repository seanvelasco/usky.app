/* @refresh reload */
import App from "./App"
import { render } from "solid-js/web"
import { MetaProvider } from "@solidjs/meta"
import { Router } from "@solidjs/router"

const root = document.getElementById("root")

render(
	() => (
		<Router>
			<MetaProvider>
				<App />
			</MetaProvider>
		</Router>
	),
	root!
)
