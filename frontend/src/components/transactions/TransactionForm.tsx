import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Person } from '../../types/person'
import { TransactionType } from '../../types/transaction'
import type { CreateTransactionRequest } from '../../types/transaction'

type TransactionFormProps = {
  isSubmitting: boolean
  people: Person[]
  isDisabled: boolean
  onSubmit: (data: CreateTransactionRequest) => Promise<void>
}

type FormErrors = {
  description?: string
  value?: string
  type?: string
  personId?: string
}

type ValidationResult = {
  errors: FormErrors
  data: CreateTransactionRequest | null
}

export function TransactionForm({
  isSubmitting,
  people,
  isDisabled,
  onSubmit,
}: TransactionFormProps) {
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [type, setType] = useState('')
  const [personId, setPersonId] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const selectedPerson = people.find((person) => person.id === Number(personId))
  const isSelectedPersonMinor = Boolean(selectedPerson && selectedPerson.age < 18)

  useEffect(() => {
    if (isSelectedPersonMinor && type === String(TransactionType.Income)) {
      setType(String(TransactionType.Expense))
    }
  }, [isSelectedPersonMinor, type])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validation = validateForm({
      description,
      value,
      type,
      personId,
      selectedPerson,
    })
    setErrors(validation.errors)

    if (!validation.data) {
      return
    }

    await onSubmit(validation.data)
    setDescription('')
    setValue('')
    setType('')
    setPersonId('')
    setErrors({})
  }

  if (people.length === 0) {
    return (
      <div className="empty-state">
        <strong>Cadastre uma pessoa antes de registrar uma transação.</strong>
        <p>
          Acesse o módulo de pessoas para incluir quem participará do controle da
          residência.
        </p>
        <Link to="/pessoas" className="button button--secondary">
          Ir para pessoas
        </Link>
      </div>
    )
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid form-grid--transactions">
        <div className="form-field form-field--wide">
          <label htmlFor="transaction-description">Descrição</label>
          <input
            id="transaction-description"
            name="description"
            type="text"
            value={description}
            maxLength={240}
            disabled={isSubmitting || isDisabled}
            aria-describedby={
              errors.description ? 'transaction-description-error' : undefined
            }
            aria-invalid={Boolean(errors.description)}
            onChange={(event) => setDescription(event.target.value)}
          />
          {errors.description ? (
            <span id="transaction-description-error" className="field-error">
              {errors.description}
            </span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="transaction-value">Valor</label>
          <input
            id="transaction-value"
            name="value"
            type="text"
            inputMode="decimal"
            value={value}
            disabled={isSubmitting || isDisabled}
            aria-describedby={errors.value ? 'transaction-value-error' : undefined}
            aria-invalid={Boolean(errors.value)}
            onChange={(event) => setValue(event.target.value)}
          />
          {errors.value ? (
            <span id="transaction-value-error" className="field-error">
              {errors.value}
            </span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="transaction-type">Tipo</label>
          <select
            id="transaction-type"
            name="type"
            value={type}
            disabled={isSubmitting || isDisabled}
            aria-describedby={errors.type ? 'transaction-type-error' : undefined}
            aria-invalid={Boolean(errors.type)}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="">Selecione o tipo</option>
            <option value={TransactionType.Expense}>Despesa</option>
            <option value={TransactionType.Income} disabled={isSelectedPersonMinor}>
              Receita
            </option>
          </select>
          {errors.type ? (
            <span id="transaction-type-error" className="field-error">
              {errors.type}
            </span>
          ) : null}
        </div>

        <div className="form-field form-field--wide">
          <label htmlFor="transaction-person">Pessoa</label>
          <select
            id="transaction-person"
            name="personId"
            value={personId}
            disabled={isSubmitting || isDisabled}
            aria-describedby={
              [
                errors.personId ? 'transaction-person-error' : null,
                isSelectedPersonMinor ? 'transaction-minor-hint' : null,
              ]
                .filter(Boolean)
                .join(' ') || undefined
            }
            aria-invalid={Boolean(errors.personId)}
            onChange={(event) => setPersonId(event.target.value)}
          >
            <option value="">Selecione uma pessoa</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} — {person.age} anos
              </option>
            ))}
          </select>
          {errors.personId ? (
            <span id="transaction-person-error" className="field-error">
              {errors.personId}
            </span>
          ) : null}
          {isSelectedPersonMinor ? (
            <span id="transaction-minor-hint" className="field-hint" aria-live="polite">
              Pessoas menores de 18 anos só podem possuir despesas.
            </span>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        className="button button--primary"
        disabled={isSubmitting || isDisabled}
      >
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar transação'}
      </button>
    </form>
  )
}

function validateForm({
  description,
  value,
  type,
  personId,
  selectedPerson,
}: {
  description: string
  value: string
  type: string
  personId: string
  selectedPerson?: Person
}): ValidationResult {
  const errors: FormErrors = {}
  const trimmedDescription = description.trim()
  const normalizedValue = value.trim().replace(',', '.')

  if (!description) {
    errors.description = 'Informe a descrição.'
  } else if (!trimmedDescription) {
    errors.description = 'A descrição não pode conter apenas espaços.'
  } else if (trimmedDescription.length > 200) {
    errors.description = 'A descrição deve possuir no máximo 200 caracteres.'
  }

  if (!value.trim()) {
    errors.value = 'Informe o valor.'
  } else if (!/^\d+(?:[.,]\d{1,2})?$/.test(value.trim())) {
    errors.value = hasTooManyDecimalPlaces(value.trim())
      ? 'O valor deve possuir no máximo duas casas decimais.'
      : 'O valor deve ser maior que zero.'
  } else if (Number(normalizedValue) <= 0) {
    errors.value = 'O valor deve ser maior que zero.'
  }

  if (!type) {
    errors.type = 'O tipo da transação é obrigatório.'
  }

  if (!personId) {
    errors.personId = 'Selecione uma pessoa.'
  }

  const parsedType = Number(type) as TransactionType
  const parsedPersonId = Number(personId)

  if (
    selectedPerson &&
    selectedPerson.age < 18 &&
    parsedType === TransactionType.Income
  ) {
    errors.type = 'Pessoas menores de 18 anos só podem possuir despesas.'
  }

  if (errors.description || errors.value || errors.type || errors.personId) {
    return { errors, data: null }
  }

  return {
    errors,
    data: {
      description: trimmedDescription,
      value: Number(normalizedValue),
      type: parsedType,
      personId: parsedPersonId,
    },
  }
}

function hasTooManyDecimalPlaces(value: string) {
  return /^\d+[.,]\d{3,}$/.test(value)
}