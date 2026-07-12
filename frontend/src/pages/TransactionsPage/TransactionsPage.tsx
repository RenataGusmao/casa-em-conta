import { useCallback, useEffect, useState } from 'react'
import { FeedbackMessage } from '../../components/feedback/FeedbackMessage'
import { TransactionForm } from '../../components/transactions/TransactionForm'
import { TransactionsList } from '../../components/transactions/TransactionsList'
import { getPeople } from '../../services/peopleService'
import {
  createTransaction,
  getTransactions,
} from '../../services/transactionService'
import type { Person } from '../../types/person'
import type {
  CreateTransactionRequest,
  Transaction,
} from '../../types/transaction'

type Feedback = {
  type: 'success' | 'error'
  message: string
}

export function TransactionsPage() {
  const [people, setPeople] = useState<Person[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setFeedback(null)

    const [peopleResult, transactionsResult] = await Promise.allSettled([
      getPeople(),
      getTransactions(),
    ])

    if (peopleResult.status === 'fulfilled') {
      setPeople(peopleResult.value)
    }

    if (transactionsResult.status === 'fulfilled') {
      setTransactions(transactionsResult.value)
    }

    if (peopleResult.status === 'rejected') {
      setFeedback({
        type: 'error',
        message: getErrorMessage(
          peopleResult.reason,
          'Não foi possível carregar as pessoas.',
        ),
      })
    } else if (transactionsResult.status === 'rejected') {
      setFeedback({
        type: 'error',
        message: getErrorMessage(
          transactionsResult.reason,
          'Não foi possível carregar as transações.',
        ),
      })
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  async function handleCreateTransaction(data: CreateTransactionRequest) {
    setIsSubmitting(true)
    setFeedback(null)

    try {
      await createTransaction(data)
      // Após cadastrar, a listagem é buscada novamente para refletir o retorno da API.
      const loadedTransactions = await getTransactions()
      setTransactions(loadedTransactions)
      setFeedback({
        type: 'success',
        message: 'Transação cadastrada com sucesso.',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Não foi possível cadastrar a transação.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Módulo de transações</p>
        <h1>Transações</h1>
        <p>Registre receitas e despesas vinculadas às pessoas da residência.</p>
      </div>

      {feedback ? (
        <FeedbackMessage
          type={feedback.type}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
        />
      ) : null}

      <section className="panel" aria-labelledby="transaction-form-title">
        <h2 id="transaction-form-title">Cadastrar transação</h2>
        {isLoading ? (
          <p className="loading-message">Carregando transações...</p>
        ) : (
          <TransactionForm
            people={people}
            isSubmitting={isSubmitting}
            isDisabled={isLoading}
            onSubmit={handleCreateTransaction}
          />
        )}
      </section>

      <section className="panel" aria-labelledby="transactions-list-title">
        <div className="section-header">
          <div>
            <h2 id="transactions-list-title">Transações cadastradas</h2>
            <p>A lista segue a ordem retornada pela API.</p>
          </div>
          <button
            type="button"
            className="button button--secondary"
            disabled={isLoading}
            onClick={() => void loadData()}
          >
            Tentar novamente
          </button>
        </div>

        {isLoading ? (
          <p className="loading-message">Carregando transações...</p>
        ) : (
          <TransactionsList transactions={transactions} />
        )}
      </section>
    </section>
  )
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}