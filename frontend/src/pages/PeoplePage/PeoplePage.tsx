import { useCallback, useEffect, useRef, useState } from 'react'
import { FeedbackMessage } from '../../components/feedback/FeedbackMessage'
import { DeleteConfirmation } from '../../components/people/DeleteConfirmation'
import { PeopleList } from '../../components/people/PeopleList'
import { PersonForm } from '../../components/people/PersonForm'
import { createPerson, deletePerson, getPeople } from '../../services/peopleService'
import type { CreatePersonRequest, Person } from '../../types/person'

type Feedback = {
  type: 'success' | 'error'
  message: string
}

export function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingPersonId, setDeletingPersonId] = useState<number | null>(null)
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const loadPeople = useCallback(async () => {
    setIsLoading(true)
    setFeedback(null)

    try {
      const loadedPeople = await getPeople()
      setPeople(loadedPeople)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Não foi possível carregar as pessoas.'),
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPeople()
  }, [loadPeople])

  async function handleCreatePerson(data: CreatePersonRequest) {
    setIsSubmitting(true)
    setFeedback(null)

    try {
      await createPerson(data)
      // Atualiza a lista após o cadastro para mostrar as informações salvas.
      await loadPeople()
      setFeedback({ type: 'success', message: 'Pessoa cadastrada com sucesso.' })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Não foi possível cadastrar a pessoa.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleConfirmDelete() {
    if (!personToDelete) {
      return
    }

    setDeletingPersonId(personToDelete.id)
    setFeedback(null)

    try {
      await deletePerson(personToDelete.id)
      setPersonToDelete(null)
      // Atualiza a lista após a exclusão para manter a tela em dia.
      await loadPeople()
      setFeedback({ type: 'success', message: 'Pessoa excluída com sucesso.' })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Não foi possível excluir a pessoa.'),
      })
    } finally {
      setDeletingPersonId(null)
    }
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Cadastro residencial</p>
        <h1>Pessoas</h1>
        <p>
          Cadastre e gerencie as pessoas que participarão do controle financeiro
          da residência.
        </p>
      </div>

      {feedback ? (
        <FeedbackMessage
          type={feedback.type}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
        />
      ) : null}

      <section className="panel panel--form" aria-labelledby="person-form-title">
        <h2 id="person-form-title">Cadastrar pessoa</h2>
        <PersonForm
          isSubmitting={isSubmitting}
          nameInputRef={nameInputRef}
          onSubmit={handleCreatePerson}
        />
      </section>

      <section className="panel panel--data" aria-labelledby="people-list-title">
        <div className="section-header">
          <div>
            <h2 id="people-list-title">Pessoas cadastradas</h2>
            <p>Acompanhe quem já está cadastrado e mantenha os dados atualizados.</p>
          </div>
          <button
            type="button"
            className="button button--secondary"
            disabled={isLoading}
            onClick={() => void loadPeople()}
          >
            Atualizar
          </button>
        </div>

        {isLoading ? (
          <p className="loading-message">Carregando pessoas...</p>
        ) : (
          <PeopleList
            people={people}
            deletingPersonId={deletingPersonId}
            onDeleteClick={setPersonToDelete}
          />
        )}
      </section>

      {personToDelete ? (
        <DeleteConfirmation
          person={personToDelete}
          isDeleting={deletingPersonId === personToDelete.id}
          onCancel={() => setPersonToDelete(null)}
          onConfirm={() => void handleConfirmDelete()}
        />
      ) : null}
    </section>
  )
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}
