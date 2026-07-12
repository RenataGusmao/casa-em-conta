type FeedbackMessageProps = {
  message: string
  type: 'success' | 'error'
  onDismiss?: () => void
}

export function FeedbackMessage({
  message,
  type,
  onDismiss,
}: FeedbackMessageProps) {
  return (
    <div className={`feedback feedback--${type}`} role="status" aria-live="polite">
      <span>{message}</span>
      {onDismiss ? (
        <button type="button" className="feedback__button" onClick={onDismiss}>
          Fechar
        </button>
      ) : null}
    </div>
  )
}
