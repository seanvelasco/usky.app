import { makePersisted } from '@solid-primitives/storage'
import { createStore } from 'solid-js/store'
import type { Session } from '../types'

const [session, setSession] = makePersisted<Session>(createStore(), { name: 'session' })

export {
    session,
    setSession
}
