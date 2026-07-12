import { formatCurrency } from '../../utils/currency'
import type { OverallTotals as OverallTotalsData } from '../../types/report'

type OverallTotalsProps = {
  overall: OverallTotalsData
}

export function OverallTotals({ overall }: OverallTotalsProps) {
  return (
    <section className="overall-totals" aria-labelledby="overall-totals-title">
      <div className="overall-totals__heading">
        <h2 id="overall-totals-title">Total geral</h2>
        <p>Consolidado de todas as pessoas cadastradas.</p>
      </div>

      <dl className="overall-totals__grid">
        <div className="overall-totals__item">
          <dt>Receitas gerais</dt>
          <dd>{formatCurrency(overall.totalIncome)}</dd>
        </div>
        <div className="overall-totals__item">
          <dt>Despesas gerais</dt>
          <dd>{formatCurrency(overall.totalExpense)}</dd>
        </div>
        <div className="overall-totals__item overall-totals__item--balance">
          <dt>Saldo líquido</dt>
          <dd>
            <span className={`balance-value ${getBalanceClass(overall.balance)}`}>
              {getBalanceLabel(overall.balance)}: {formatCurrency(overall.balance)}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  )
}

function getBalanceClass(balance: number) {
  if (balance > 0) {
    return 'balance-value--positive'
  }

  if (balance < 0) {
    return 'balance-value--negative'
  }

  return 'balance-value--zero'
}

function getBalanceLabel(balance: number) {
  if (balance > 0) {
    return 'Positivo'
  }

  if (balance < 0) {
    return 'Negativo'
  }

  return 'Zerado'
}