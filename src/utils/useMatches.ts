import { useLocation } from "@solidjs/router"

// @solidjs/router useMatch() doesn't yet allow matching for multiple routes yet

// Returns () => true if one of routes given match the current path
const useMatches = (routes: () => string[]) => {
    const location = useLocation()
    return () => routes().some(path => location.pathname.startsWith(path))
}

export default useMatches