import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PeopleList } from './PeopleList'
import type { Person } from '../../types/person'

const people: Person[] = [
  { id: 1, name: 'Mariana Freitas', age: 28 },
  { id: 2, name: 'Lucas Almeida', age: 17 },
]

describe('PeopleList', () => {
  it('exibe identificador, nome e idade das pessoas', () => {
    render(<PeopleList people={people} deletingPersonId={null} onDeleteClick={vi.fn()} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Mariana Freitas')).toBeInTheDocument()
    expect(screen.getByText('28')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Lucas Almeida')).toBeInTheDocument()
    expect(screen.getByText('17')).toBeInTheDocument()
  })

  it('chama a ação de exclusão', async () => {
    const user = userEvent.setup()
    const onDeleteClick = vi.fn()
    render(<PeopleList people={people} deletingPersonId={null} onDeleteClick={onDeleteClick} />)

    await user.click(screen.getAllByRole('button', { name: 'Excluir' })[0])

    expect(onDeleteClick).toHaveBeenCalledWith(people[0])
  })

  it('exibe estado vazio', () => {
    render(<PeopleList people={[]} deletingPersonId={null} onDeleteClick={vi.fn()} />)

    expect(screen.getByText('Nenhuma pessoa cadastrada.')).toBeInTheDocument()
    expect(screen.getByText('Utilize o formulário acima para cadastrar a primeira pessoa.')).toBeInTheDocument()
  })
})