import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TransactionForm } from './TransactionForm'
import type { Person } from '../../types/person'
import { TransactionType } from '../../types/transaction'
import type { CreateTransactionRequest } from '../../types/transaction'

const people: Person[] = [
  { id: 1, name: 'Ana', age: 28 },
  { id: 2, name: 'Bruno', age: 17 },
  { id: 3, name: 'Carla', age: 18 },
]

function renderForm(options?: { isSubmitting?: boolean; isDisabled?: boolean; people?: Person[] }) {
  const onSubmit = vi.fn(async (_data: CreateTransactionRequest) => {})

  render(
    <MemoryRouter>
      <TransactionForm
        people={options?.people ?? people}
        isSubmitting={options?.isSubmitting ?? false}
        isDisabled={options?.isDisabled ?? false}
        onSubmit={onSubmit}
      />
    </MemoryRouter>,
  )

  return { onSubmit }
}

async function fillValidExpense(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Descrição'), 'Mercado')
  await user.type(screen.getByLabelText('Valor'), '100')
  await user.selectOptions(screen.getByLabelText('Pessoa'), '1')
  await user.selectOptions(screen.getByLabelText('Tipo'), String(TransactionType.Expense))
}

describe('TransactionForm', () => {
  it('renderiza descrição, valor, tipo e pessoa', () => {
    renderForm()

    expect(screen.getByLabelText('Descrição')).toBeInTheDocument()
    expect(screen.getByLabelText('Valor')).toBeInTheDocument()
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument()
    expect(screen.getByLabelText('Pessoa')).toBeInTheDocument()
  })

  it('exige descrição', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Valor'), '100')
    await user.selectOptions(screen.getByLabelText('Pessoa'), '1')
    await user.selectOptions(screen.getByLabelText('Tipo'), String(TransactionType.Expense))
    await user.click(screen.getByRole('button', { name: 'Cadastrar transação' }))

    expect(await screen.findByText('Informe a descrição.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('bloqueia descrição apenas com espaços', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Descrição'), '   ')
    await user.type(screen.getByLabelText('Valor'), '100')
    await user.selectOptions(screen.getByLabelText('Pessoa'), '1')
    await user.selectOptions(screen.getByLabelText('Tipo'), String(TransactionType.Expense))
    await user.click(screen.getByRole('button', { name: 'Cadastrar transação' }))

    expect(await screen.findByText('A descrição não pode conter apenas espaços.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('bloqueia descrição acima de 200 caracteres', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Descrição'), 'A'.repeat(201))
    await user.type(screen.getByLabelText('Valor'), '100')
    await user.selectOptions(screen.getByLabelText('Pessoa'), '1')
    await user.selectOptions(screen.getByLabelText('Tipo'), String(TransactionType.Expense))
    await user.click(screen.getByRole('button', { name: 'Cadastrar transação' }))

    expect(await screen.findByText('A descrição deve possuir no máximo 200 caracteres.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('exige valor', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Descrição'), 'Mercado')
    await user.selectOptions(screen.getByLabelText('Pessoa'), '1')
    await user.selectOptions(screen.getByLabelText('Tipo'), String(TransactionType.Expense))
    await user.click(screen.getByRole('button', { name: 'Cadastrar transação' }))

    expect(await screen.findByText('Informe o valor.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('bloqueia valor zero, negativo e com mais de duas casas decimais', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()
    const valueInput = screen.getByLabelText('Valor')

    await user.type(screen.getByLabelText('Descrição'), 'Mercado')
    await user.selectOptions(screen.getByLabelText('Pessoa'), '1')
    await user.selectOptions(screen.getByLabelText('Tipo'), String(TransactionType.Expense))

    await user.type(valueInput, '0')
    await user.click(screen.getByRole('button', { name: 'Cadastrar transação' }))
    expect(await screen.findByText('O valor deve ser maior que zero.')).toBeInTheDocument()

    await user.clear(valueInput)
    await user.type(valueInput, '-1')
    await user.click(screen.getByRole('button', { name: 'Cadastrar transação' }))
    expect(await screen.findByText('O valor deve ser maior que zero.')).toBeInTheDocument()

    await user.clear(valueInput)
    await user.type(valueInput, '10,999')
    await user.click(screen.getByRole('button', { name: 'Cadastrar transação' }))
    expect(await screen.findByText('O valor deve possuir no máximo duas casas decimais.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('exige tipo e pessoa', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Descrição'), 'Mercado')
    await user.type(screen.getByLabelText('Valor'), '100')
    await user.click(screen.getByRole('button', { name: 'Cadastrar transação' }))

    expect(await screen.findByText('O tipo da transação é obrigatório.')).toBeInTheDocument()
    expect(screen.getByText('Selecione uma pessoa.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('permite despesa para menor e envia o ID da pessoa e enum correto', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Descrição'), '  Lanche  ')
    await user.type(screen.getByLabelText('Valor'), '25,50')
    await user.selectOptions(screen.getByLabelText('Pessoa'), '2')
    await user.selectOptions(screen.getByLabelText('Tipo'), String(TransactionType.Expense))
    await user.click(screen.getByRole('button', { name: 'Cadastrar transação' }))

    expect(onSubmit).toHaveBeenCalledWith({
      description: 'Lanche',
      value: 25.5,
      type: TransactionType.Expense,
      personId: 2,
    })
  })

  it('desabilita Receita para menor de 18 anos e mostra orientação', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.selectOptions(screen.getByLabelText('Pessoa'), '2')

    expect(screen.getByRole('option', { name: 'Receita' })).toBeDisabled()
    expect(screen.getByText('Pessoas menores de 18 anos só podem possuir despesas.')).toBeInTheDocument()
  })

  it('permite Receita para pessoa com exatamente 18 anos e para adulto', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Descrição'), 'Bolsa')
    await user.type(screen.getByLabelText('Valor'), '500')
    await user.selectOptions(screen.getByLabelText('Pessoa'), '3')
    await user.selectOptions(screen.getByLabelText('Tipo'), String(TransactionType.Income))
    await user.click(screen.getByRole('button', { name: 'Cadastrar transação' }))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ type: TransactionType.Income, personId: 3 }))

    await user.type(screen.getByLabelText('Descrição'), 'Salário')
    await user.type(screen.getByLabelText('Valor'), '1000')
    await user.selectOptions(screen.getByLabelText('Pessoa'), '1')
    await user.selectOptions(screen.getByLabelText('Tipo'), String(TransactionType.Income))
    await user.click(screen.getByRole('button', { name: 'Cadastrar transação' }))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ type: TransactionType.Income, personId: 1 }))
  })

  it('bloqueia envio duplicado durante carregamento', () => {
    renderForm({ isSubmitting: true })

    expect(screen.getByRole('button', { name: 'Cadastrando...' })).toBeDisabled()
  })

  it('exibe comportamento adequado quando não existem pessoas', () => {
    renderForm({ people: [] })

    expect(screen.getByText('Cadastre uma pessoa antes de registrar uma transação.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir para pessoas' })).toHaveAttribute('href', '/pessoas')
  })

  it('envia dados válidos após preencher o formulário', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await fillValidExpense(user)
    await user.click(screen.getByRole('button', { name: 'Cadastrar transação' }))

    expect(onSubmit).toHaveBeenCalledWith({
      description: 'Mercado',
      value: 100,
      type: TransactionType.Expense,
      personId: 1,
    })
  })
})