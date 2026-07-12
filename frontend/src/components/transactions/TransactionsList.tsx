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
        <p>Utilize o formulário acima para registrar a primeira transação.</p>
      </div>
    )
  }

  return (
    <div className="table-wrap">
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
              <td>{transaction.id}</td>
              <td>{transaction.description}</td>
              <td>{transaction.personName}</td>
              <td>
                <span className={`transaction-type transaction-type--${transaction.type}`}>
                  {getTypeLabel(transaction.type)}
                </span>
              </td>
              <td>{formatCurrency(transaction.value)}</td>
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