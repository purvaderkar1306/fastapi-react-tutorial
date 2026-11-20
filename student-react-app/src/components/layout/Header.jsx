import { Link, NavLink } from 'react-router-dom'

import { useApiStatus } from '../../hooks/useApiStatus.js'
import { useTheme } from '../../hooks/useTheme.js'
import Icon from '../ui/Icon.jsx'

const STATUS_LABEL = { checking: 'Checking API…', online: 'API online', offline: 'API offline' }

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { status, mysqlVersion } = useApiStatus()

  return (
    <header className="app-header">
      <div className="container header-inner">
        <Link className="brand" to="/">
          <img src="/favicon.svg" alt="" className="brand-logo" />
          <span>
            Student<strong>Manager</strong>
          </span>
        </Link>

        <nav className="nav" aria-label="Main">
          {/* NavLink adds class="active" when its page is open */}
          <NavLink to="/students" className="nav-link">
            Students
          </NavLink>
        </nav>

        <div className="header-actions">
          <span
            className={`api-status ${status === 'checking' ? '' : status}`}
            title={mysqlVersion ? `MySQL ${mysqlVersion}` : 'API connection status'}
          >
            <span className="dot" />
            <span className="label">{STATUS_LABEL[status]}</span>
          </span>

          <button
            type="button"
            className="btn btn-icon btn-ghost"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Icon name={theme === 'dark' ? 'moon' : 'sun'} />
          </button>

          <a className="btn btn-ghost btn-sm hide-sm" href="http://127.0.0.1:8000/docs" target="_blank" rel="noopener noreferrer">
            API Docs
          </a>
        </div>
      </div>
    </header>
  )
}
