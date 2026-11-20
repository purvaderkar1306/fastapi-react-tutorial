import { Outlet } from 'react-router-dom'

import Header from './Header.jsx'

/** The frame around every page: header on top, the page in the middle, footer below. */
export default function Layout() {
  return (
    <>
      <Header />
      <main className="container main">
        {/* <Outlet /> is replaced by the page that matches the current URL */}
        <Outlet />
      </main>
      <footer className="app-footer">
        <div className="container muted">FastAPI + MySQL · React + Vite + Axios</div>
      </footer>
    </>
  )
}
