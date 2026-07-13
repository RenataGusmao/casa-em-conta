import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OverallTotals } from './OverallTotals'

describe('OverallTotals', () => {
  it('exibe receitas, despesas e saldo líquido em reais', () => {
    render(
      <OverallTotals
        overall={{ totalIncome: 3000, totalExpense: 600, balance: 2400 }}
      />,
    )

    expect(screen.getByText('Receitas')).toBeInTheDocument()
    expect(screen.getByText('Despesas')).toBeInTheDocument()
    expect(screen.getByText('Saldo líquido')).toBeInTheDocument()
    expect(screen.getByText('R$ 3.000,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 600,00')).toBeInTheDocument()
    expect(screen.getByText('Sobra').closest('.balance-value')).toHaveTextContent('R$ 2.400,00')
  })

  it('exibe saldo negativo com sinal', () => {
    render(
      <OverallTotals overall={{ totalIncome: 100, totalExpense: 220, balance: -120 }} />,
    )

    expect(screen.getByText('Falta').closest('.balance-value')).toHaveTextContent('-R$ 120,00')
  })

  it('exibe saldo líquido zerado', () => {
    render(
      <OverallTotals overall={{ totalIncome: 100, totalExpense: 100, balance: 0 }} />,
    )

    expect(screen.getByText('Em dia').closest('.balance-value')).toHaveTextContent('R$ 0,00')
  })
})