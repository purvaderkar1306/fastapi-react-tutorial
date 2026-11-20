import Avatar from '../../components/ui/Avatar.jsx'
import CourseBadge from '../../components/ui/CourseBadge.jsx'
import Modal from '../../components/ui/Modal.jsx'

/** Read-only details card for one student. */
export default function StudentViewModal({ open, student, onClose, onEdit }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Student Details"
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onEdit(student)}>
            Edit
          </button>
        </>
      }
    >
      {student && (
        <>
          <div className="profile">
            <Avatar name={student.name} large />
            <h3>{student.name}</h3>
            <CourseBadge course={student.course} />
          </div>
          <dl className="detail-list">
            <div>
              <dt>ID</dt>
              <dd>#{student.id}</dd>
            </div>
            <div>
              <dt>Age</dt>
              <dd>{student.age} years</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{student.email}</dd>
            </div>
            <div>
              <dt>Added</dt>
              <dd>{formatDate(student.created_at)}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{formatDate(student.updated_at)}</dd>
            </div>
          </dl>
        </>
      )}
    </Modal>
  )
}

function formatDate(value) {
  if (!value) return '–'
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
