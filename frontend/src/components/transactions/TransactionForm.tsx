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

type ParsedCurrency =
  | { isValid: true; value: number }
  | { isValid: false; reason: 'empty' | 'format' | 'decimalPlaces' | 'nonPositive' }

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
    // A restrição melhora a experiência do usuário, mas a regra continua
    // sendo validada obrigatoriamente pela API.
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
        <strong>Cadastre uma pessoa para começar.</strong>
        <p>Depois disso, você poderá registrar receitas e despesas para ela.</p>
        <Link to="/pessoas" className="button button--secondary empty-state__action">
          Ir para pessoas
        </Link>
      </div>
    )
  }

  const valueDescription = errors.value
    ? 'transaction-value-help transaction-value-error'
    : 'transaction-value-help'

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
            placeholder="Ex.: Conta de energia"
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
          <div className="money-input">
            <span className="money-input__prefix" aria-hidden="true">
              R$
            </span>
            <input
              id="transaction-value"
              name="value"
              type="text"
              inputMode="decimal"
              value={value}
              placeholder="Ex.: 6.500,00"
              disabled={isSubmitting || isDisabled}
              aria-describedby={valueDescription}
              aria-invalid={Boolean(errors.value)}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
          <span id="transaction-value-help" className="field-hint">
            Aceita vírgula e ponto de milhar. O prefixo não precisa ser digitado.
          </span>
          {errors.value ? (
            <span id="transaction-value-error" className="field-error">
              {errors.value}
            </span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="transaction-type">Tipo</label>
          <div className="select-control">
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
          </div>
          {errors.type ? (
            <span id="transaction-type-error" className="field-error">
              {errors.type}
            </span>
          ) : null}
        </div>

        <div className="form-field form-field--wide">
          <label htmlFor="transaction-person">Pessoa</label>
          <div className="select-control">
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
                  {person.name} - {person.age} anos
                </option>
              ))}
            </select>
          </div>
          {errors.personId ? (
            <span id="transaction-person-error" className="field-error">
              {errors.personId}
            </span>
          ) : null}
          {isSelectedPersonMinor ? (
            <span id="transaction-minor-hint" className="field-hint" aria-live="polite">
              Para menores de 18 anos, registre apenas despesas.
            </span>
          ) : null}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="button button--primary"
          disabled={isSubmitting || isDisabled}
        >
          {isSubmitting ? 'Salvando...' : 'Cadastrar transação'}
        </button>
      </div>
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
  const parsedValue = parseCurrencyInput(value)

  if (!description) {
    errors.description = 'Informe a descrição.'
  } else if (!trimmedDescription) {
    errors.description = 'A descrição não pode conter apenas espaços.'
  } else if (trimmedDescription.length > 200) {
    errors.description = 'A descrição deve ter no máximo 200 caracteres.'
  }

  if (!parsedValue.isValid) {
    errors.value = getValueErrorMessage(parsedValue.reason)
  }

  if (!type) {
    errors.type = 'Selecione o tipo da transação.'
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
    errors.type = 'Para menores de 18 anos, registre apenas despesas.'
  }

  if (errors.description || errors.value || errors.type || errors.personId) {
    return { errors, data: null }
  }

  return {
    errors,
    data: {
      description: trimmedDescription,
      value: parsedValue.isValid ? parsedValue.value : 0,
      type: parsedType,
      personId: parsedPersonId,
    },
  }
}

function parseCurrencyInput(rawValue: string): ParsedCurrency {
  const trimmedValue = rawValue.trim()

  if (!trimmedValue) {
    return { isValid: false, reason: 'empty' }
  }

  const normalizedInput = trimmedValue.replace(/\s/g, '')

  if (/^R\$/i.test(normalizedInput)) {
    return { isValid: false, reason: 'format' }
  }

  const plainNumberPattern = /^-?\d+(,\d{1,2})?$/
  const brThousandsPattern = /^-?\d{1,3}(\.\d{3})+(,\d{1,2})?$/

  if (!plainNumberPattern.test(normalizedInput) && !brThousandsPattern.test(normalizedInput)) {
    if (/^-?\d+,\d{3,}$/.test(normalizedInput)) {
      return { isValid: false, reason: 'decimalPlaces' }
    }

    return { isValid: false, reason: 'format' }
  }

  const normalizedValue = normalizedInput.replace(/\./g, '').replace(',', '.')
  const parsedValue = Number(normalizedValue)

  if (!Number.isFinite(parsedValue)) {
    return { isValid: false, reason: 'format' }
  }

  if (parsedValue <= 0) {
    return { isValid: false, reason: 'nonPositive' }
  }

  return { isValid: true, value: parsedValue }
}

function getValueErrorMessage(reason: Exclude<ParsedCurrency, { isValid: true }>['reason']) {
  if (reason === 'empty') {
    return 'Informe o valor.'
  }

  if (reason === 'decimalPlaces') {
    return 'Use no máximo duas casas decimais.'
  }

  if (reason === 'nonPositive') {
    return 'O valor deve ser maior que zero.'
  }

  return 'Informe um valor válido, como 6500,00.'
}
