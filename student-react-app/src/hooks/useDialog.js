import { useContext } from 'react'

import { DialogContext } from '../context/dialog-context.js'

/**
 * const dialog = useDialog()
 * dialog.success('Saved', 'Asha was added.')
 * const yes = await dialog.confirm({ title: 'Delete?', okText: 'Delete', danger: true })
 */
export function useDialog() {
  const context = useContext(DialogContext)
  if (!context) throw new Error('useDialog must be used inside <DialogProvider>')
  return context
}
