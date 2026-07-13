import { useState } from 'react'
import type { FormEvent, RefObject } from 'react'
import type { CreatePersonRequest } from '../../types/person'

type PersonFormProps = {
  isSubmitting: boolean
  nameInputRef: RefObject<HTMLInputElement | null>
  onSubmit: (data: CreatePersonRequest) => Promise<void>
}

type FormErrors = {
  name?: string
  age?: string
}

export function PersonForm({
  isSubmitting,
  nameInputRef,
  onSubmit,
}: PersonFormProps) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validation = validateForm(name, age)
    setErrors(validation.errors)

    if (!validation.data) {
      return
    }

    await onSubmit(validation.data)
    setName('')
    setAge('')
    setErrors({})
    nameInputRef.current?.focus()
  }

  return (
    <form className="person-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="person-name">Nome</label>
          <input
            ref={nameInputRef}
            id="person-name"
            name="name"
            type="text"
            value={name}
            maxLength={180}
            placeholder="Ex.: Ana Souza"
            disabled={isSubmitting}
            aria-describedby={errors.name ? 'person-name-error' : undefined}
            aria-invalid={Boolean(errors.name)}
            onChange={(event) => setName(event.target.value)}
          />
          {errors.name ? (
            <span id="person-name-error" className="field-error">
              {errors.name}
            </span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="person-age">Idade</label>
          <input
            id="person-age"
            name="age"
            type="number"
            inputMode="numeric"
            value={age}
            min="0"
            max="120"
            step="1"
            placeholder="Ex.: 32"
            disabled={isSubmitting}
            aria-describedby={errors.age ? 'person-age-error' : undefined}
            aria-invalid={Boolean(errors.age)}
            onChange={(event) => setAge(event.target.value)}
          />
          {errors.age ? (
            <span id="person-age-error" className="field-error">
              {errors.age}
            </span>
          ) : null}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Cadastrar pessoa'}
        </button>
      </div>
    </form>
  )
}

function validateForm(name: string, age: string) {
  const errors: FormErrors = {}
  const trimmedName = name.trim()

  if (!name) {
    errors.name = 'Informe o nome.'
  } else if (!trimmedName) {
    errors.name = 'O nome não pode conter apenas espaços.'
  } else if (trimmedName.length > 150) {
    errors.name = 'O nome deve possuir no máximo 150 caracteres.'
  }

  if (!age) {
    errors.age = 'Informe a idade.'
  } else if (!/^-?\d+(\.\d+)?$/.test(age) || !Number.isInteger(Number(age))) {
    errors.age = 'A idade deve ser um número inteiro.'
  } else {
    const parsedAge = Number(age)

    if (parsedAge < 0 || parsedAge > 120) {
      errors.age = 'A idade deve estar entre 0 e 120 anos.'
    }
  }

  if (errors.name || errors.age) {
    return { errors, data: null }
  }

  return {
    errors,
    data: {
      name: trimmedName,
      age: Number(age),
    },
  }
}
