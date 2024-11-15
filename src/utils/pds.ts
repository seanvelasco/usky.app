import type { Session } from '../types'

const pds = (session: Session) => session?.didDoc?.service[0]?.serviceEndpoint

export default pds
