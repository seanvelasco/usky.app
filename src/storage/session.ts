import { makePersisted } from '@solid-primitives/storage'
import { createStore } from 'solid-js/store'
import type { Session } from '../types'

// To-do: correctly type below. <Session | Record<string, string>> is obviously incorrect, but is currently working

const [session, setSession] = makePersisted(createStore<Session | Record<string, string>>(), { name: 'session' })

export {
    session,
    setSession
}
