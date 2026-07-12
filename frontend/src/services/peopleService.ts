import { apiRequest } from './api'
import type { CreatePersonRequest, Person } from '../types/person'

export function getPeople(): Promise<Person[]> {
  return apiRequest<Person[]>(
    'people',
    undefined,
    'Não foi possível carregar as pessoas.',
  )
}

export function createPerson(data: CreatePersonRequest): Promise<Person> {
  return apiRequest<Person>(
    'people',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    'Não foi possível cadastrar a pessoa.',
  )
}

export function deletePerson(id: number): Promise<void> {
  return apiRequest<void>(
    `people/${id}`,
    {
      method: 'DELETE',
    },
    'Não foi possível excluir a pessoa.',
  )
}
