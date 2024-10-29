import { createAsync } from '@solidjs/router'
import listConvos from '../../api/convo/listConvos'

const Messages = () => {
	const convos = createAsync(() => listConvos())
	return <>{JSON.stringify(convos)}</>
}

export default Messages
