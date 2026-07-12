import { useCallback, useEffect, useState } from 'react'
import { FeedbackMessage } from '../../components/feedback/FeedbackMessage'
import { OverallTotals } from '../../components/reports/OverallTotals'
import { TotalsTable } from '../../components/reports/TotalsTable'
import { getTotalsReport } from '../../services/reportService'
import type { TotalsReport } from '../../types/report'

type Feedback = {
  type: 'error'
  message: string
}

export function TotalsPage() {
  const [report, setReport] = useState<TotalsReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const loadTotals = useCallback(async () => {
    setIsLoading(true)
    setFeedback(null)

    try {
      const loadedReport = await getTotalsReport()
      validateTotalsReport(loadedReport)
      setReport(loadedReport)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Não foi possível carregar os totais.'),
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTotals()
  }, [loadTotals])

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Consulta de totais</p>
        <h1>Totais</h1>
        <p>Consulte receitas, despesas e saldos de cada pessoa da residência.</p>
      </div>

      {feedback ? (
        <FeedbackMessage
          type={feedback.type}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
        />
      ) : null}

      <section className="panel" aria-labelledby="totals-list-title">
        <div className="section-header">
          <div>
            <h2 id="totals-list-title">Totais por pessoa</h2>
            <p>Todas as pessoas retornadas pela API aparecem nesta listagem.</p>
          </div>
          <button
            type="button"
            className="button button--secondary"
            disabled={isLoading}
            onClick={() => void loadTotals()}
          >
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>

        {isLoading ? (
          <p className="loading-message" aria-live="polite">
            Carregando totais...
          </p>
        ) : report ? (
          <div className="totals-content">
            <TotalsTable people={report.people} />
            <OverallTotals overall={report.overall} />
          </div>
        ) : (
          <div className="empty-state" aria-live="polite">
            <strong>Não foi possível carregar os totais.</strong>
            <p>Confira se a API está em execução e tente novamente.</p>
            <button
              type="button"
              className="button button--secondary empty-state__action"
              onClick={() => void loadTotals()}
            >
              Tentar novamente
            </button>
          </div>
        )}
      </section>
    </section>
  )
}

function validateTotalsReport(report: TotalsReport) {
  if (!Array.isArray(report.people) || !report.overall) {
    throw new Error('Não foi possível carregar os totais.')
  }
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}