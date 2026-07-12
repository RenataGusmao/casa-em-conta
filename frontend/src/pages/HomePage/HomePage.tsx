import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHealth } from '../../services/api'

type ApiStatus = 'checking' | 'connected' | 'unavailable'

export function HomePage() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking')

  useEffect(() => {
    let isMounted = true

    getHealth()
      .then(() => {
        if (isMounted) {
          setApiStatus('connected')
        }
      })
      .catch(() => {
        if (isMounted) {
          setApiStatus('unavailable')
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const statusLabel = {
    checking: 'Verificando API',
    connected: 'API conectada',
    unavailable: 'API indisponível',
  }[apiStatus]

  return (
    <section className="hero-section">
      <div className="hero-card">
        <div className="brand-mark" aria-hidden="true">
          <span>R$</span>
        </div>

        <div className="hero-content">
          <p className="eyebrow">Controle de gastos residenciais</p>
          <h1>Casa em Conta</h1>
          <p className="summary">
            Cadastre pessoas e registre receitas e despesas da residência com
            clareza.
          </p>
          <Link to="/pessoas" className="button button--primary hero-action">
            Acessar pessoas
          </Link>
        </div>

        <div className={`api-status api-status--${apiStatus}`}>
          <span className="status-dot" aria-hidden="true" />
          {statusLabel}
        </div>
      </div>
    </section>
  )
}