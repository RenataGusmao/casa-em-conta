import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TotalsPage } from './TotalsPage'
import { getTotalsReport } from '../../services/reportService'
import type { TotalsReport } from '../../types/report'

vi.mock('../../services/reportService', () => ({
  getTotalsReport: vi.fn(),
}))

const report: TotalsReport = {
  people: [
    {
      personId: 1,
      personName: 'Mariana Freitas',
      totalIncome: 1000,
      totalExpense: 250,
      balance: 750,
    },
  ],
  overall: {
    totalIncome: 1000,
    totalExpense: 250,
    balance: 750,
  },
}

function renderPage() {
  render(
    <MemoryRouter>
      <TotalsPage />
    </MemoryRouter>,
  )
}

describe('TotalsPage', () => {
  beforeEach(() => {
    vi.mocked(getTotalsReport).mockReset()
  })

  it('exibe carregamento inicial', () => {
    vi.mocked(getTotalsReport).mockReturnValue(new Promise(() => {}))

    renderPage()

    expect(screen.getByText('Carregando totais...')).toBeInTheDocument()
  })

  it('exibe o relatório carregado', async () => {
    vi.mocked(getTotalsReport).mockResolvedValue(report)

    renderPage()

    expect(await screen.findByText('Mariana Freitas')).toBeInTheDocument()
    expect(screen.getAllByText('R$ 1.000,00')).toHaveLength(2)
    expect(screen.getAllByText('Positivo: R$ 750,00')).toHaveLength(2)
  })

  it('exibe erro amigável e tenta novamente', async () => {
    const user = userEvent.setup()
    vi.mocked(getTotalsReport)
      .mockRejectedValueOnce(new Error('Não foi possível conectar à API.'))
      .mockResolvedValueOnce(report)

    renderPage()

    expect(await screen.findByText('Não foi possível conectar à API.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Atualizar' }))

    expect(await screen.findByText('Mariana Freitas')).toBeInTheDocument()
    expect(getTotalsReport).toHaveBeenCalledTimes(2)
  })

  it('botão Atualizar realiza nova consulta', async () => {
    const user = userEvent.setup()
    vi.mocked(getTotalsReport).mockResolvedValue(report)

    renderPage()
    await screen.findByText('Mariana Freitas')

    await user.click(screen.getByRole('button', { name: 'Atualizar' }))

    expect(getTotalsReport).toHaveBeenCalledTimes(2)
  })

  it('estado vazio possui acesso à página de pessoas', async () => {
    vi.mocked(getTotalsReport).mockResolvedValue({
      people: [],
      overall: { totalIncome: 0, totalExpense: 0, balance: 0 },
    })

    renderPage()

    expect(await screen.findByText('Nenhuma pessoa cadastrada.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir para pessoas' })).toHaveAttribute('href', '/pessoas')
  })
})