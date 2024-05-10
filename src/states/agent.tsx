import { createContext, useContext, type JSXElement } from 'solid-js'
import { BskyAgent } from '@atproto/api'
import { SERVICE_BASE_URL } from '../constants'

const AgentContext = createContext<BskyAgent>()

const AgentProvider = (props: { service?: string; children: JSXElement }) => {
	const agent = new BskyAgent({
		service: props.service ?? SERVICE_BASE_URL
	})

	return (
		<AgentContext.Provider value={agent}>
			{props.children}
		</AgentContext.Provider>
	)
}

const useAgent = () => {
	const agent = useContext(AgentContext)

	if (!agent) {
		throw new Error('useAgent must be used within an AgentProvider')
	}

	return agent
}

export { AgentProvider, useAgent }
