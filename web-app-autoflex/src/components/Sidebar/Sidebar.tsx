import { NavLink } from 'react-router-dom'
import { navItems } from './navItems'
import autoflexLogo from '../../assets/images/autoflex.png'

interface SidebarProps {
  dismissOnNavigate?: boolean
}

export function Sidebar({ dismissOnNavigate = false }: SidebarProps) {
  return (
    <div className="d-flex flex-column h-100">
      <div className="px-2 py-2 border-bottom bg-light">
        <img src={autoflexLogo} alt="Logo AutoFlex" className="img-fluid" />
      </div>

      <nav className="nav nav-pills flex-column gap-1 p-1" aria-label="NavegaÃ§Ã£o principal">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            data-bs-dismiss={dismissOnNavigate ? 'offcanvas' : undefined}
            className={({ isActive }) =>
              `nav-link text-start ${isActive ? 'active' : 'link-dark'}`
            }
          >
            <i className={`${item.iconClass} me-2`} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}


