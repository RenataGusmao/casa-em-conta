import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PersonForm } from './PersonForm'
import type { CreatePersonRequest } from '../../types/person'

function renderForm(isSubmitting = false) {
  const nameInputRef = createRef<HTMLInputElement>()
  const onSubmit = vi.fn(async (_data: CreatePersonRequest) => {})

  render(
    <PersonForm
      isSubmitting={isSubmitting}
      nameInputRef={nameInputRef}
      onSubmit={onSubmit}
    />,
  )

  return { onSubmit }
}

describe('PersonForm', () => {
  it('renderiza os campos Nome e Idade', () => {
    renderForm()

    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Idade')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cadastrar pessoa' })).toBeInTheDocument()
  })

  it('bloqueia nome vazio', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Idade'), '30')
    await user.click(screen.getByRole('button', { name: 'Cadastrar pessoa' }))

    expect(await screen.findByText('Informe o nome.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('bloqueia nome apenas com espaços', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Nome'), '   ')
    await user.type(screen.getByLabelText('Idade'), '30')
    await user.click(screen.getByRole('button', { name: 'Cadastrar pessoa' }))

    expect(await screen.findByText('O nome não pode conter apenas espaços.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('bloqueia nome acima de 150 caracteres', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Nome'), 'A'.repeat(151))
    await user.type(screen.getByLabelText('Idade'), '30')
    await user.click(screen.getByRole('button', { name: 'Cadastrar pessoa' }))

    expect(await screen.findByText('O nome deve possuir no máximo 150 caracteres.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('bloqueia idade vazia', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Nome'), 'Ana')
    await user.click(screen.getByRole('button', { name: 'Cadastrar pessoa' }))

    expect(await screen.findByText('Informe a idade.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('bloqueia idade negativa', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Nome'), 'Ana')
    await user.type(screen.getByLabelText('Idade'), '-1')
    await user.click(screen.getByRole('button', { name: 'Cadastrar pessoa' }))

    expect(await screen.findByText('A idade deve estar entre 0 e 120 anos.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('bloqueia idade decimal', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Nome'), 'Ana')
    await user.type(screen.getByLabelText('Idade'), '10.5')
    await user.click(screen.getByRole('button', { name: 'Cadastrar pessoa' }))

    expect(await screen.findByText('A idade deve ser um número inteiro.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('bloqueia idade acima de 120', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Nome'), 'Ana')
    await user.type(screen.getByLabelText('Idade'), '121')
    await user.click(screen.getByRole('button', { name: 'Cadastrar pessoa' }))

    expect(await screen.findByText('A idade deve estar entre 0 e 120 anos.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('permite idade 0 e aplica trim antes de enviar', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Nome'), '  Bebê  ')
    await user.type(screen.getByLabelText('Idade'), '0')
    await user.click(screen.getByRole('button', { name: 'Cadastrar pessoa' }))

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Bebê', age: 0 })
  })

  it('chama o callback com os dados corretos', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Nome'), 'Ana Souza')
    await user.type(screen.getByLabelText('Idade'), '28')
    await user.click(screen.getByRole('button', { name: 'Cadastrar pessoa' }))

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ana Souza', age: 28 })
  })

  it('desabilita o botão durante envio', () => {
    renderForm(true)

    expect(screen.getByRole('button', { name: 'Cadastrando...' })).toBeDisabled()
  })
})