import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OverallTotals } from './OverallTotals'

describe('OverallTotals', () => {
  it('exibe receitas gerais, despesas gerais e saldo líquido em reais', () => {
    render(
      <OverallTotals
        overall={{ totalIncome: 3000, totalExpense: 600, balance: 2400 }}
      />,
    )

    expect(screen.getByText('Receitas gerais')).toBeInTheDocument()
    expect(screen.getByText('Despesas gerais')).toBeInTheDocument()
    expect(screen.getByText('Saldo líquido')).toBeInTheDocument()
    expect(screen.getByText('R$ 3.000,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 600,00')).toBeInTheDocument()
    expect(screen.getByText('Positivo: R$ 2.400,00')).toBeInTheDocument()
  })

  it('exibe saldo negativo com sinal', () => {
    render(
      <OverallTotals overall={{ totalIncome: 100, totalExpense: 220, balance: -120 }} />,
    )

    expect(screen.getByText('Negativo: -R$ 120,00')).toBeInTheDocument()
  })

  it('exibe saldo líquido zerado', () => {
    render(
      <OverallTotals overall={{ totalIncome: 100, totalExpense: 100, balance: 0 }} />,
    )

    expect(screen.getByText('Zerado: R$ 0,00')).toBeInTheDocument()
  })
})