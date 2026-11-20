import { useState } from 'react'

import { parseApiError } from '../../api/errors.js'
import { studentsApi } from '../../api/students.js'
import Modal from '../../components/ui/Modal.jsx'
import { useDialog } from '../../hooks/useDialog.js'
import { changedFields, toFormValues, toPayload, validateStudent } from '../../utils/student.js'

const FORM_ID = 'student-form'

/**
 * Add / Edit form in a modal.
 * The parent gives it a new `key` each time it opens, so the form always starts fresh.
 *
 *   student = null   -> Add (POST /students)
 *   student = {...}  -> Edit (PATCH /students/{id}, only the changed fields)
 */
export default function StudentFormModal({ open, student, courses, onClose, onSaved }) {
  const isEdit = Boolean(student)
  const dialog = useDialog()

  const [values, setValues] = useState(() => toFormValues(student))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors(({ [name]: _removed, ...rest }) => rest) // clear this field's error
  }

  const showErrors = (fieldErrors) => {
    setErrors(fieldErrors)
    const firstField = Object.keys(fieldErrors)[0]
    document.getElementById(`field-${firstField}`)?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // stop the browser from reloading the page

    const data = toPayload(values)
    const fieldErrors = validateStudent(data)
    if (Object.keys(fieldErrors).length > 0) {
      showErrors(fieldErrors)
      return
    }

    let request
    if (isEdit) {
      const changes = changedFields(data, student)
      if (Object.keys(changes).length === 0) {
        onClose()
        dialog.info('No changes', 'Nothing was modified, so no request was sent.')
        return
      }
      request = studentsApi.update(student.id, changes)
    } else {
      request = studentsApi.create(data)
    }

    setSaving(true)
    try {
      const saved = await request
      onSaved(saved, isEdit)
    } catch (err) {
      const problem = parseApiError(err)
      if (Object.keys(problem.fieldErrors).length > 0) showErrors(problem.fieldErrors)
      dialog.error(problem.title, problem.message, problem.items)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Student #${student.id}` : 'Add Student'}
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          {/* form={FORM_ID} lets a button outside the <form> submit it */}
          <button type="submit" form={FORM_ID} className="btn btn-primary" disabled={saving}>
            {saving && <span className="spinner spinner-sm" />}
            <span>{isEdit ? 'Update' : 'Save'}</span>
          </button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <Field
            name="name"
            label="Full name"
            span2
            error={errors.name}
            type="text"
            placeholder="Asha Patil"
            maxLength={100}
            value={values.name}
            onChange={handleChange}
          />

          <Field
            name="age"
            label="Age"
            error={errors.age}
            type="number"
            min={1}
            max={120}
            placeholder="20"
            value={values.age}
            onChange={handleChange}
          />

          <Field
            name="course"
            label="Course"
            error={errors.course}
            type="text"
            list="course-list"
            placeholder="Computer Science"
            maxLength={100}
            value={values.course}
            onChange={handleChange}
          />
          <datalist id="course-list">
            {courses.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <Field
            name="email"
            label="Email"
            span2
            error={errors.email}
            type="email"
            placeholder="asha@example.com"
            value={values.email}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  )
}

/**
 * Label + input + error message.
 * Any extra props (type, value, onChange, placeholder...) are passed straight to the <input>.
 */
function Field({ name, label, span2 = false, error, ...inputProps }) {
  const id = `field-${name}`
  const errorId = `${id}-error`

  return (
    <div className={`form-group ${span2 ? 'span-2' : ''}`}>
      <label htmlFor={id}>
        {label} <span className="req">*</span>
      </label>
      <input
        {...inputProps}
        id={id}
        name={name}
        className={`input ${error ? 'is-invalid' : ''}`.trim()}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
      />
      <small id={errorId} className="field-error">
        {error}
      </small>
    </div>
  )
}
