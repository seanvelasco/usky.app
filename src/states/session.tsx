import { createContext, useContext, type JSXElement } from 'solid-js'
import { createAsync, query, action, redirect } from '@solidjs/router'
import { reconcile } from 'solid-js/store'
import createSession from '../api/identity/createSession'
import getSession from '../api/identity/getSession'
import refreshSession from '../api/identity/refreshSession'
import {
	session as sessionStorage,
	setSession as setSessionStorage
} from '../storage/session'
import type { Session } from '../types'

const runSessionLogic = async () => {
	// "bruh" moment
	// accessors are undefined, logic does not work
	// also, if an inner IF is false, it does evaluate the outer ELSE, it will just return
	console.log(sessionStorage.accessJwt)
	if (sessionStorage.accessJwt) {
		const session = await getSession(sessionStorage.accessJwt)
		if (session.active) {
			console.log('This is a valid session', session)
			// setSessionStorage(session() as Session)
		} else if (sessionStorage.refreshJwt) {
			console.log(`Unable to getSession, attempting to refresh`)
			const session = await refreshSession(sessionStorage.refreshJwt)
			if (session) {
				console.log('Tokens refreshed', session)
				setSessionStorage('accessJwt', session.accessJwt!)
				setSessionStorage('refreshJwt', session.refreshJwt!)
			} else {
				console.log('Unable to refresh revoked, NUCLEAR')
				setSessionStorage(reconcile({}))
			}
		}
	} else {
		console.log('Unable to refresh revoked, NUCLEAR')
		setSessionStorage(reconcile({}))
	}
}

export const checkSession = query(() => runSessionLogic(), 'check_session')

const SessionContext = createContext<Session>()

const SessionProvider = (props: { service?: string; children: JSXElement }) => {
	createAsync(() => checkSession())
	// const pds = () =>
	// 	(sessionStorage as Session)?.didDoc?.service[0]?.serviceEndpoint
	// problem seems to happen bc sessionStorage is spread
	// const value = {
	// 	pds: pds(),
	// 	...()
	// }
	return (
		<SessionContext.Provider value={sessionStorage as Session}>
			{props.children}
		</SessionContext.Provider>
	)
}

// should this be an exported fn or should this be part of value like { session, logout } = useSession?
const logout = action(() => {
	// const navigate = useNavigate()
	setSessionStorage(reconcile({}))
	// navigate('/', { replace: true })
	throw redirect('/', { revalidate: 'session' })
})

const login = action(async (formData: FormData) => {
	const identifier = String(formData.get('identifier'))
	const password = String(formData.get('password'))
	console.log({ identifier, password })
	const session = await createSession({ identifier, password })
	if (session) {
		setSessionStorage(session)
		return redirect('/', { revalidate: ['getAllTodos'] })
	}
})

const useSession = () => {
	const session = useContext(SessionContext)

	if (!session) {
		throw new Error('useSession must be used within an SessionProvider')
	}

	return session
}

export { SessionProvider, useSession, logout, login }
