import { createContext } from 'react'

/** Holds the dialog functions (alert, confirm, ...). Filled in by <DialogProvider>. */
export const DialogContext = createContext(null)
