import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TotalsTable } from './TotalsTable'
import type { PersonTotals } from '../../types/report'

const people: PersonTotals[] = [
  {
    personId: 1,
    personName: 'Ana',
    totalIncome: 3000,
    totalExpense: 500,
    balance: 2500,
  },
  {
    personId: 2,
    personName: 'Bruno',
    totalIncome: 0,
    totalExpense: 120,
    balance: -120,
  },
  {
    personId: 3,
    personName: 'Carla',
    totalIncome: 200,
    totalExpense: 200,
    balance: 0,
  },
  {
    personId: 4,
    personName: 'Diego',
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  },
]

describe('TotalsTable', () => {
  it('exibe todas as pessoas e os valores em reais', () => {
    render(<TotalsTable people={people} />, { wrapper: MemoryRouter })

    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Bruno')).toBeInTheDocument()
    expect(screen.getByText('Carla')).toBeInTheDocument()
    expect(screen.getByText('Diego')).toBeInTheDocument()
    expect(screen.getByText('R$ 3.000,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 500,00')).toBeInTheDocument()
    expect(screen.getByText('Positivo: R$ 2.500,00')).toBeInTheDocument()
  })

  it('exibe pessoa sem transações com valores zerados', () => {
    render(<TotalsTable people={people} />, { wrapper: MemoryRouter })

    const diegoRow = screen.getByText('Diego').closest('tr')

    expect(diegoRow).not.toBeNull()
    expect(diegoRow).toHaveTextContent('R$ 0,00')
    expect(diegoRow).toHaveTextContent('Zerado: R$ 0,00')
  })

  it('exibe saldo negativo com texto e sinal', () => {
    render(<TotalsTable people={people} />, { wrapper: MemoryRouter })

    expect(screen.getByText('Negativo: -R$ 120,00')).toBeInTheDocument()
  })

  it('exibe saldo zero com texto claro', () => {
    render(<TotalsTable people={people} />, { wrapper: MemoryRouter })

    expect(screen.getAllByText('Zerado: R$ 0,00')).toHaveLength(2)
  })

  it('exibe estado vazio com acesso à página de pessoas', () => {
    render(<TotalsTable people={[]} />, { wrapper: MemoryRouter })

    expect(screen.getByText('Nenhuma pessoa cadastrada.')).toBeInTheDocument()
    expect(screen.getByText('Cadastre uma pessoa para começar a acompanhar os totais.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir para pessoas' })).toHaveAttribute('href', '/pessoas')
  })
})