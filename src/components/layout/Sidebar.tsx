import { A, useLocation, useParams, useRouteData } from "@solidjs/router";
import { Route, Routes } from "@solidjs/router";
import { Show, Suspense, createResource } from "solid-js";
import getSuggestions from "../../api/actor/getSuggestions";
import getPopularFeedGenerators from "../../api/unspecced/getPopularFeedGenerators";
import { PostData } from "../../routes/profile/[profile]/post/[post]";
import Search from "../Search";
import Section, { ActorsSection } from "../Section";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
	const location = useLocation();
	const params = useParams();

	const [users] = createResource(() => params.profile ?? "", getSuggestions);
	const [feeds] = createResource(getPopularFeedGenerators);

	return (
		<Suspense>
			<Show when={location.pathname !== "/search"}>
				<Search />
			</Show>

			<Routes>
				<Route path="" component={RelevantSection} />
				<Route
					path="/profile/:profile/post/:post"
					component={RelevantSection}
					data={PostData}
				/>
			</Routes>
			<Show
				when={
					location.pathname !== "/search" &&
					// !params.profile &&
					users()
				}
			>
				{(actors) => <ActorsSection title="People" actors={actors().actors} />}
			</Show>

			<Show when={location.pathname !== "/feeds" && feeds()?.feeds}>
				{(feeds) => <Section title="Feeds" list={feeds()} />}
			</Show>
			<footer class={styles.footer}>
				<A href="/about">About</A>
			</footer>
		</Suspense>
	);
};

const RelevantSection = () => {
	const post = useRouteData<typeof PostData>();

	return (
		<Show when={post && post()?.actors}>
			{(actors) => <ActorsSection title="Relevant people" actors={actors()} />}
		</Show>
	);
};

export default Sidebar;
