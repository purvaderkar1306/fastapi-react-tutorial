import { useCallback, useMemo, useState } from 'react'

import AlertDialog from '../components/ui/AlertDialog.jsx'
import { DialogContext } from './dialog-context.js'

let nextId = 1

/**
 * Wrap the app in <DialogProvider> once (see main.jsx).
 * Any component inside can then use the useDialog() hook (hooks/useDialog.js).
 * Dialogs wait in a queue, so two of them never overlap.
 */
export default function DialogProvider({ children }) {
  const [queue, setQueue] = useState([])

  // Add a dialog to the queue. The Promise resolves when the user clicks a button.
  const show = useCallback(
    (options) => new Promise((resolve) => setQueue((q) => [...q, { id: nextId++, options, resolve }])),
    [],
  )

  const dialog = useMemo(() => {
    const alert = (options) => show({ showCancel: false, ...options })
    return {
      alert,
      success: (title, message) => alert({ type: 'success', title, message }),
      error: (title, message, items) => alert({ type: 'error', title, message, items }),
      warning: (title, message) => alert({ type: 'warning', title, message }),
      info: (title, message) => alert({ type: 'info', title, message }),
      confirm: (options) => show({ type: 'question', showCancel: true, okText: 'Yes', ...options }),
    }
  }, [show])

  const current = queue[0]

  const handleDone = (answer) => {
    current.resolve(answer) // the caller's `await dialog.confirm(...)` receives this
    setQueue((q) => q.slice(1)) // show the next dialog, if any
  }

  return (
    <DialogContext.Provider value={dialog}>
      {children}
      {/* key: a new AlertDialog for every queued item, so each one animates in */}
      {current && <AlertDialog key={current.id} options={current.options} onDone={handleDone} />}
    </DialogContext.Provider>
  )
}
