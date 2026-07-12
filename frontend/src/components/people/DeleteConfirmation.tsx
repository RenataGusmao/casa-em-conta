import { useEffect, useRef } from 'react'
import type { Person } from '../../types/person'

type DeleteConfirmationProps = {
  isDeleting: boolean
  person: Person
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteConfirmation({
  isDeleting,
  person,
  onCancel,
  onConfirm,
}: DeleteConfirmationProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isDeleting) {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDeleting, onCancel])

  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-person-title"
      >
        <h2 id="delete-person-title">Excluir pessoa</h2>
        <p>
          Deseja excluir {person.name}? Quando houver transações vinculadas, elas
          também serão removidas.
        </p>
        <div className="modal-actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="button button--secondary"
            disabled={isDeleting}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="button button--danger"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? 'Excluindo...' : 'Confirmar exclusão'}
          </button>
        </div>
      </div>
    </div>
  )
}
