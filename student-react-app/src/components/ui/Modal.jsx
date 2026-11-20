import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const ANIMATION_MS = 240 // a little longer than the CSS transition (--dur: 220ms)
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Shared by every Modal: which modals are open (top-most last), and how many lock the page scroll
const openStack = []
let scrollLocks = 0

/**
 * Reusable modal window with an open/close animation.
 *
 * Props:
 *   open             show (true) or hide (false) the modal
 *   onClose          called when the user asks to close it (×, Esc, backdrop)
 *   onExited         called after the closing animation has finished
 *   title            heading text; leave it out for a modal without a header
 *   footer           buttons at the bottom
 *   size             "md" (560px) or "sm" (420px)
 *   closeOnBackdrop  false = shake instead of closing when the backdrop is clicked
 *   role             "dialog" or "alertdialog"
 */
export default function Modal({
  open,
  onClose,
  onExited,
  title,
  children,
  footer,
  size = 'md',
  className = '',
  footerClassName = '',
  bodyClassName = '',
  closeOnBackdrop = true,
  role = 'dialog',
  labelledBy,
  describedBy,
}) {
  const id = useId()
  const titleId = labelledBy ?? `${id}-title`

  const [mounted, setMounted] = useState(open) // is it in the page at all?
  const [visible, setVisible] = useState(false) // has the .show class (fully visible)?
  const [shaking, setShaking] = useState(false)

  const rootRef = useRef(null)
  const bodyRef = useRef(null)
  const returnFocusRef = useRef(null)

  // Keep the latest callbacks without re-running the effects below every render
  const onCloseRef = useRef(onClose)
  const onExitedRef = useRef(onExited)
  useEffect(() => {
    onCloseRef.current = onClose
    onExitedRef.current = onExited
  })

  // 1. React to the `open` prop changing, while rendering (React's recommended pattern):
  //    opening -> put it in the page;  closing -> remove .show so the closing animation plays
  if (open && !mounted) setMounted(true)
  if (!open && visible) setVisible(false)

  // 2. Opening: once it is in the page, force a reflow, then add .show on the next frame
  //    so the CSS transition runs from the hidden "before" state.
  useEffect(() => {
    if (!open || !mounted) return undefined
    void rootRef.current?.offsetWidth // reflow: the browser records the "before" state
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [open, mounted])

  // Closing: wait for the animation to finish, then take it out of the page
  useEffect(() => {
    if (open || !mounted) return undefined
    const timer = setTimeout(() => setMounted(false), ANIMATION_MS)
    return () => clearTimeout(timer)
  }, [open, mounted])

  // 3. After it has been removed: tell the parent, and give focus back to where it was
  const wasMounted = useRef(mounted)
  useEffect(() => {
    if (wasMounted.current && !mounted) {
      onExitedRef.current?.()
      returnFocusRef.current?.focus?.()
    }
    wasMounted.current = mounted
  }, [mounted])

  // 4. While in the page: lock page scroll, listen for Esc / Tab (only the top-most modal reacts)
  useEffect(() => {
    if (!mounted) return undefined

    returnFocusRef.current = document.activeElement // remember what to focus again after closing
    openStack.push(id)
    scrollLocks += 1
    document.body.classList.add('modal-open')

    const onKeyDown = (e) => {
      if (openStack.at(-1) !== id) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current?.()
      }
      if (e.key === 'Tab') trapFocus(e, rootRef.current)
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      openStack.splice(openStack.indexOf(id), 1)
      scrollLocks -= 1
      if (scrollLocks === 0) document.body.classList.remove('modal-open')
    }
  }, [mounted, id])

  // 5. When it becomes visible: move focus inside (first field, or the main button)
  useEffect(() => {
    if (!visible) return undefined
    const timer = setTimeout(() => {
      const root = rootRef.current
      if (!root || root.contains(document.activeElement)) return
      const target =
        bodyRef.current?.querySelector('[autofocus]') ??
        bodyRef.current?.querySelector(FOCUSABLE) ??
        root.querySelector('.modal-footer .btn-primary, .modal-footer .btn-danger')
      target?.focus()
    }, 50)
    return () => clearTimeout(timer)
  }, [visible])

  const shake = () => {
    setShaking(false)
    requestAnimationFrame(() => setShaking(true))
    setTimeout(() => setShaking(false), 420)
  }

  const handleBackdropClick = () => (closeOnBackdrop ? onClose?.() : shake())

  if (!mounted) return null

  const classes = ['modal', className, visible && 'show', shaking && 'shake'].filter(Boolean).join(' ')

  // createPortal renders the modal at the end of <body>, outside the page layout,
  // so no parent's CSS (overflow, z-index...) can cut it off.
  return createPortal(
    <div
      ref={rootRef}
      className={classes}
      role={role}
      aria-modal="true"
      aria-labelledby={title ? titleId : labelledBy}
      aria-describedby={describedBy}
    >
      <div className="modal-backdrop" onClick={handleBackdropClick} />
      <div className={`modal-dialog ${size === 'sm' ? 'modal-sm' : ''}`}>
        <div className="modal-content">
          {title && (
            <header className="modal-header">
              <h2 id={titleId}>{title}</h2>
              <button type="button" className="modal-close" onClick={() => onClose?.()} aria-label="Close">
                &times;
              </button>
            </header>
          )}
          <div ref={bodyRef} className={`modal-body ${bodyClassName}`.trim()}>
            {children}
          </div>
          {footer && <footer className={`modal-footer ${footerClassName}`.trim()}>{footer}</footer>}
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** Keep Tab / Shift+Tab inside the modal */
function trapFocus(e, root) {
  if (!root) return
  const items = [...root.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
  if (items.length === 0) return
  const first = items[0]
  const last = items.at(-1)
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
