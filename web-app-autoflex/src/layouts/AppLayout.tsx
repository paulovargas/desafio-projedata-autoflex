import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar/Sidebar'

const DESKTOP_SIDEBAR_WIDTH = 240

export function AppLayout() {
  const location = useLocation()
  const pageTitleMap: Record<string, string> = {
    '/': 'Painel',
    '/products': 'Produtos',
    '/raw-materials': 'Matérias-primas',
    '/production': 'Produção',
  }

  const pageTitle = pageTitleMap[location.pathname] ?? 'Aplicação'

  return (
    <div className="bg-body-tertiary min-vh-100">
      <aside
        className="app-sidebar-desktop d-none d-lg-block position-fixed top-0 start-0 bg-white border-end"
        style={{ width: DESKTOP_SIDEBAR_WIDTH, height: '100vh', zIndex: 1030 }}
        aria-label="Barra lateral"
      >
        <Sidebar />
      </aside>

      <div className="app-content-shell d-flex flex-column min-vh-100">
        <header className="navbar bg-white border-bottom sticky-top">
          <div className="container-fluid">
            <button
              className="btn btn-outline-secondary d-lg-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#appSidebarOffcanvas"
              aria-controls="appSidebarOffcanvas"
              aria-label="Abrir navegação"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="d-flex flex-column ms-2 ms-lg-0">
              <span className="text-uppercase text-secondary small">Aplicação</span>
              <span className="fw-semibold">{pageTitle}</span>
            </div>
          </div>
        </header>

        <main className="flex-grow-1">
          <div className="container-fluid py-4">
            <Outlet />
          </div>
        </main>
      </div>

      <div
        className="offcanvas offcanvas-start d-lg-none"
        tabIndex={-1}
        id="appSidebarOffcanvas"
        aria-labelledby="appSidebarOffcanvasLabel"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title" id="appSidebarOffcanvasLabel">
            Navegação
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Fechar" />
        </div>
        <div className="offcanvas-body p-0">
          <Sidebar dismissOnNavigate />
        </div>
      </div>
    </div>
  )
}
