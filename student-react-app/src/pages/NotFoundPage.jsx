import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="card not-found">
      <span className="code">404</span>
      <h1>Page not found</h1>
      <p className="muted">There is no page at this address.</p>
      <Link to="/students" className="btn btn-primary">
        Go to Students
      </Link>
    </section>
  )
}
