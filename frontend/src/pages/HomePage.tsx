import { useEffect, useState } from 'react'
import { getHealth } from '../services/api'

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
    unavailable: 'API indisponivel',
  }[apiStatus]

  return (
    <main className="home-page">
      <section className="intro">
        <div className="brand-mark" aria-hidden="true">
          <span>R$</span>
        </div>

        <div className="intro-content">
          <p className="eyebrow">Controle de gastos residenciais</p>
          <h1>Casa em Conta</h1>
          <p className="summary">
            A estrutura inicial da aplicacao esta configurada para evoluir com
            API, interface web, persistencia e testes automatizados.
          </p>
        </div>

        <div className={`api-status api-status--${apiStatus}`}>
          <span className="status-dot" aria-hidden="true" />
          {statusLabel}
        </div>
      </section>
    </main>
  )
}
