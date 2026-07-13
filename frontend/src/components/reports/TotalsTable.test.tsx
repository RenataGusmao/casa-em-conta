import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TotalsTable } from './TotalsTable'
import type { PersonTotals } from '../../types/report'

const people: PersonTotals[] = [
  {
    personId: 1,
    personName: 'Mariana Freitas',
    totalIncome: 3000,
    totalExpense: 500,
    balance: 2500,
  },
  {
    personId: 2,
    personName: 'Lucas Almeida',
    totalIncome: 0,
    totalExpense: 120,
    balance: -120,
  },
  {
    personId: 3,
    personName: 'Beatriz Souza',
    totalIncome: 200,
    totalExpense: 200,
    balance: 0,
  },
  {
    personId: 4,
    personName: 'Ana Ribeiro',
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  },
]

describe('TotalsTable', () => {
  it('exibe todas as pessoas e os valores em reais', () => {
    render(<TotalsTable people={people} />, { wrapper: MemoryRouter })

    expect(screen.getByText('Mariana Freitas')).toBeInTheDocument()
    expect(screen.getByText('Lucas Almeida')).toBeInTheDocument()
    expect(screen.getByText('Beatriz Souza')).toBeInTheDocument()
    expect(screen.getByText('Ana Ribeiro')).toBeInTheDocument()
    expect(screen.getByText('R$ 3.000,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 500,00')).toBeInTheDocument()
    expect(screen.getByText('Sobra').closest('.balance-value')).toHaveTextContent('R$ 2.500,00')
  })

  it('exibe pessoa sem transações com valores zerados', () => {
    render(<TotalsTable people={people} />, { wrapper: MemoryRouter })

    const anaRibeiroRow = screen.getByText('Ana Ribeiro').closest('tr')

    expect(anaRibeiroRow).not.toBeNull()
    expect(anaRibeiroRow).toHaveTextContent('R$ 0,00')
    expect(anaRibeiroRow).toHaveTextContent('Em dia')
  })

  it('exibe saldo negativo com texto e sinal', () => {
    render(<TotalsTable people={people} />, { wrapper: MemoryRouter })

    expect(screen.getByText('Falta').closest('.balance-value')).toHaveTextContent('-R$ 120,00')
  })

  it('exibe saldo zero com texto claro', () => {
    render(<TotalsTable people={people} />, { wrapper: MemoryRouter })

    expect(screen.getAllByText('Em dia')).toHaveLength(2)
  })

  it('exibe estado vazio com acesso à página de pessoas', () => {
    render(<TotalsTable people={[]} />, { wrapper: MemoryRouter })

    expect(screen.getByText('Nenhuma pessoa cadastrada.')).toBeInTheDocument()
    expect(screen.getByText('Cadastre uma pessoa para começar a acompanhar os totais.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir para pessoas' })).toHaveAttribute('href', '/pessoas')
  })
})