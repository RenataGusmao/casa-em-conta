import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/currency'
import type { PersonTotals } from '../../types/report'

type TotalsTableProps = {
  people: PersonTotals[]
}

export function TotalsTable({ people }: TotalsTableProps) {
  if (people.length === 0) {
    return (
      <div className="empty-state">
        <strong>Nenhuma pessoa cadastrada.</strong>
        <p>Cadastre uma pessoa para começar a acompanhar os totais.</p>
        <Link to="/pessoas" className="button button--secondary empty-state__action">
          Ir para pessoas
        </Link>
      </div>
    )
  }

  return (
    <div className="table-wrap" role="region" aria-label="Totais por pessoa" tabIndex={0}>
      <table className="people-table totals-table">
        <thead>
          <tr>
            <th scope="col">Pessoa</th>
            <th scope="col">Receitas</th>
            <th scope="col">Despesas</th>
            <th scope="col">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.personId}>
              <td>
                <strong className="table-primary-text">{person.personName}</strong>
              </td>
              <td className="table-money">{formatCurrency(person.totalIncome)}</td>
              <td className="table-money">{formatCurrency(person.totalExpense)}</td>
              <td className="table-money">
                <span className={`balance-value ${getBalanceClass(person.balance)}`}>
                  <span className="balance-value__label">{getBalanceLabel(person.balance)}</span>
                  {formatCurrency(person.balance)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
    return 'Sobra'
  }

  if (balance < 0) {
    return 'Falta'
  }

  return 'Em dia'
}
