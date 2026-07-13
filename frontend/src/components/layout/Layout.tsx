import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <NavLink to="/" className="app-brand">
            <span className="app-brand__mark" aria-hidden="true">
              R$
            </span>
            <span className="app-brand__copy">
              <span>Casa em Conta</span>
              <small>Finanças residenciais</small>
            </span>
          </NavLink>

          <nav className="app-nav" aria-label="Navegação principal">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
              }
              end
            >
              Início
            </NavLink>
            <NavLink
              to="/pessoas"
              className={({ isActive }) =>
                isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
              }
            >
              Pessoas
            </NavLink>
            <NavLink
              to="/transacoes"
              className={({ isActive }) =>
                isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
              }
            >
              Transações
            </NavLink>
            <NavLink
              to="/totais"
              className={({ isActive }) =>
                isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
              }
            >
              Totais
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
