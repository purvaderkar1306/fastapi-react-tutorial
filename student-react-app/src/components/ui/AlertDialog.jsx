import { useId, useRef, useState } from 'react'

import Icon from './Icon.jsx'
import Modal from './Modal.jsx'

/**
 * One alert or confirm dialog. Rendered by DialogProvider; you don't use it directly.
 * Calls onDone(true) for OK, onDone(false) for Cancel, after the closing animation.
 */
export default function AlertDialog({ options, onDone }) {
  const {
    type = 'info',
    title,
    message,
    items = [],
    okText = 'OK',
    cancelText = 'Cancel',
    showCancel = false,
    danger = false,
  } = options

  const id = useId()
  const [open, setOpen] = useState(true)
  const answer = useRef(false)

  const finish = (value) => {
    answer.current = value
    setOpen(false) // starts the closing animation; onExited fires afterwards
  }

  return (
    <Modal
      open={open}
      onClose={() => finish(!showCancel)} // Esc = Cancel on a confirm, OK on a plain alert
      onExited={() => onDone(answer.current)}
      size="sm"
      className="modal-alert"
      role="alertdialog"
      labelledBy={`${id}-title`}
      describedBy={`${id}-message`}
      closeOnBackdrop={false}
      bodyClassName="text-center"
      footerClassName="modal-footer-center"
      footer={
        <>
          {showCancel && (
            <button type="button" className="btn btn-outline" onClick={() => finish(false)}>
              {cancelText}
            </button>
          )}
          <button
            type="button"
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => finish(true)}
            autoFocus
          >
            {okText}
          </button>
        </>
      }
    >
      <div className={`alert-icon ${type === 'question' ? 'warning' : type}`}>
        <Icon name={type} />
      </div>
      <h2 id={`${id}-title`} className="alert-title">
        {title}
      </h2>
      <div id={`${id}-message`} className="alert-message">
        {message}
        {items.length > 0 && (
          <ul>
            {items.map((item, index) => (
              <li key={`${item.field}-${index}`}>
                <strong>{item.field}</strong>: {item.msg}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  )
}
