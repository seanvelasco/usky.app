import { createContext, useContext } from 'solid-js'

interface DialogContextValue {
	toggle: () => void,
	open: boolean
}

export const DialogContext = createContext<DialogContextValue>()

const useDialogContext = () => {
	const context = useContext(DialogContext)
	if (!context) {
		throw new Error("useDialogContext")
	}
	return context
}

export default useDialogContext