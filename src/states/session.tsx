import { createContext, useContext, type JSXElement } from 'solid-js'
import { reconcile } from 'solid-js/store'
import { createAsync, cache, action, redirect } from '@solidjs/router'
import createSession from '../api/identity/createSession'
import getSession from '../api/identity/getSession'
import refreshSession from '../api/identity/refreshSession'
import {
	session as sessionStorage,
	setSession as setSessionStorage
} from '../storage/session'
import type { Session } from '../types'

const getBlueskySession = cache(
	(accessJwt: string) => getSession(accessJwt),
	'session'
)

const refreshBlueskySession = cache(
	(refreshJwt: string) => refreshSession(refreshJwt),
	'refresh_session'
)

const SessionContext = createContext<Session>()

const SessionProvider = (props: { service?: string; children: JSXElement }) => {
	if (sessionStorage.accessJwt) {
		const session = createAsync(() =>
			getBlueskySession(sessionStorage.accessJwt)
		)
		if (session()) {
			setSessionStorage(session() as Session)
		} else if (sessionStorage.refreshJwt) {
			const session = createAsync(() =>
				refreshBlueskySession(sessionStorage.refreshJwt)
			)
			if (session()) {
				setSessionStorage('accessJwt', session()?.accessJwt!)
				setSessionStorage('refreshJwt', session()?.refreshJwt!)
			}
		}
	} else {
		setSessionStorage(reconcile({}))
	}

	return (
		<SessionContext.Provider value={sessionStorage as Session}>
			{props.children}
		</SessionContext.Provider>
	)
}

// should this be an exported fn or should this be part of value like { session, logout } = useSession?
const logout = () => {
	setSessionStorage(reconcile({}))
	throw redirect('/')
}

const login = action(async (formData: FormData) => {
	const identifier = String(formData.get('identifier'))
	const password = String(formData.get('password'))
	console.log({ identifier, password })
	const session = await createSession({ identifier, password })
	if (session) {
		setSessionStorage(session)
		throw redirect('/')
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
