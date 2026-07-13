import { formatCurrency } from '../../utils/currency'
import { TransactionType } from '../../types/transaction'
import type { Transaction } from '../../types/transaction'

type TransactionsListProps = {
  transactions: Transaction[]
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <strong>Nenhuma transação cadastrada.</strong>
        <p>Registre a primeira movimentação para acompanhar o saldo.</p>
      </div>
    )
  }

  return (
    <div className="table-wrap" role="region" aria-label="Transações cadastradas" tabIndex={0}>
      <table className="people-table transactions-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Descrição</th>
            <th scope="col">Pessoa</th>
            <th scope="col">Tipo</th>
            <th scope="col">Valor</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="table-id">#{transaction.id}</td>
              <td>
                <strong className="table-primary-text">{transaction.description}</strong>
              </td>
              <td className="table-secondary-text">{transaction.personName}</td>
              <td>
                <span className={`transaction-type transaction-type--${transaction.type}`}>
                  {getTypeLabel(transaction.type)}
                </span>
              </td>
              <td className="table-money">{formatCurrency(transaction.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function getTypeLabel(type: TransactionType) {
  return type === TransactionType.Income ? 'Receita' : 'Despesa'
}
