import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TransactionsList } from './TransactionsList'
import { TransactionType } from '../../types/transaction'
import type { Transaction } from '../../types/transaction'

const transactions: Transaction[] = [
  {
    id: 1,
    description: 'Salário',
    value: 2500,
    type: TransactionType.Income,
    personId: 1,
    personName: 'Ana',
  },
  {
    id: 2,
    description: 'Mercado',
    value: 120.5,
    type: TransactionType.Expense,
    personId: 1,
    personName: 'Ana',
  },
]

describe('TransactionsList', () => {
  it('exibe descrição, pessoa, tipo e valores formatados em reais', () => {
    render(<TransactionsList transactions={transactions} />)

    expect(screen.getByText('Salário')).toBeInTheDocument()
    expect(screen.getAllByText('Ana')).toHaveLength(2)
    expect(screen.getByText('Receita')).toBeInTheDocument()
    expect(screen.getByText('Despesa')).toBeInTheDocument()
    expect(screen.getByText('R$ 2.500,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 120,50')).toBeInTheDocument()
  })

  it('exibe estado vazio', () => {
    render(<TransactionsList transactions={[]} />)

    expect(screen.getByText('Nenhuma transação cadastrada.')).toBeInTheDocument()
    expect(screen.getByText('Utilize o formulário acima para registrar a primeira transação.')).toBeInTheDocument()
  })

  it('não apresenta ações de edição ou exclusão', () => {
    render(<TransactionsList transactions={transactions} />)

    expect(screen.queryByRole('button', { name: /editar/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument()
  })
})