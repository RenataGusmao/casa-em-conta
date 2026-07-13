import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHealth } from '../../services/api'

type ApiStatus = 'checking' | 'connected' | 'unavailable'

const modules = [
  {
    title: 'Pessoas',
    description: 'Organize quem participa do controle financeiro da casa.',
    href: '/pessoas',
    icon: 'P',
    meta: 'Cadastro',
  },
  {
    title: 'Transações',
    description: 'Registre receitas e despesas com valores em reais.',
    href: '/transacoes',
    icon: 'R$',
    meta: 'Movimentações',
  },
  {
    title: 'Totais',
    description: 'Consulte saldos individuais e o resultado consolidado.',
    href: '/totais',
    icon: 'T',
    meta: 'Resumo',
  },
]

const flowItems = [
  { label: 'Pessoas', value: 'Cadastro residencial' },
  { label: 'Transações', value: 'Receitas e despesas' },
  { label: 'Totais', value: 'Saldo por pessoa' },
]

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
    checking: 'Verificando conexão',
    connected: 'Conexão ativa',
    unavailable: 'Conexão indisponível',
  }[apiStatus]

  return (
    <section className="home-section">
      <div className="home-hero">
        <div className="hero-content">
          <p className="eyebrow">Controle financeiro residencial</p>
          <h1>Casa em Conta</h1>
          <p className="summary">
            Uma área simples para registrar moradores, lançar movimentações e acompanhar
            o saldo da residência sem perder clareza sobre quem recebeu ou gastou.
          </p>
          <div className="hero-actions">
            <Link to="/transacoes" className="button button--primary hero-action">
              Registrar transação
            </Link>
            <Link to="/totais" className="button button--secondary hero-action">
              Ver totais
            </Link>
          </div>
        </div>

        <aside className="home-insight" aria-label="Fluxo do controle financeiro">
          <div className={`api-status api-status--${apiStatus}`}>
            <span className="status-dot" aria-hidden="true" />
            {statusLabel}
          </div>
          <div className="insight-card">
            <span className="insight-card__label">Fluxo de uso</span>
            <dl className="insight-list">
              {flowItems.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      <div className="quick-access">
        <div className="section-header section-header--plain">
          <div>
            <h2>Acessos rápidos</h2>
            <p>Entre direto nos módulos principais do controle financeiro.</p>
          </div>
        </div>

        <div className="module-grid" aria-label="Áreas do sistema">
          {modules.map((module) => (
            <Link key={module.href} to={module.href} className="module-card">
              <span className="module-card__icon" aria-hidden="true">
                {module.icon}
              </span>
              <span className="module-card__meta">{module.meta}</span>
              <strong>{module.title}</strong>
              <p>{module.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
