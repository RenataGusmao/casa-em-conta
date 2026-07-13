import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DeleteConfirmation } from './DeleteConfirmation'

const person = { id: 1, name: 'Mariana Freitas', age: 28 }

describe('DeleteConfirmation', () => {
  it('exibe modal acessível com nome e ações', () => {
    render(
      <DeleteConfirmation
        person={person}
        isDeleting={false}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )

    expect(screen.getByRole('dialog', { name: 'Excluir pessoa' })).toBeInTheDocument()
    expect(screen.getByText(/Deseja excluir Mariana Freitas/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Confirmar exclusão' })).toBeInTheDocument()
  })

  it('chama cancelar e confirmar exclusão', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    render(
      <DeleteConfirmation
        person={person}
        isDeleting={false}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Confirmar exclusão' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})