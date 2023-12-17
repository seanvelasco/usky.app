import { For, createResource } from "solid-js"
import { useRouteData, type RouteDataFuncArgs } from "@solidjs/router"
import Entry from "../../../../components/Entry"
import getLists from "../../../../api/graph/getLists"
import { id } from "../../../../utils"

export const ListsData = ({ params }: RouteDataFuncArgs) => {
	const [lists] = createResource(() => params.profile, getLists)
	return lists
}

export const Lists = () => {
	const lists = useRouteData<typeof ListsData>()

	if (lists.error) {
		return <p>Unable to retrieve lists</p>
	}

	return (
		<For each={lists()?.lists}>
			{(list) => (
				<>
					<Entry
						type="creator"
						displayName={list.name}
						description={list.description}
						avatar="/avatar_group.svg"
						href={`/profile/${list.creator.handle}/lists/${id(
							list.uri
						)}`}
					/>
				</>
			)}
		</For>
	)
}

export default  Lists