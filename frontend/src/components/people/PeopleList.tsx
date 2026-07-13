import type { Person } from '../../types/person'

type PeopleListProps = {
  deletingPersonId: number | null
  people: Person[]
  onDeleteClick: (person: Person) => void
}

export function PeopleList({
  deletingPersonId,
  people,
  onDeleteClick,
}: PeopleListProps) {
  if (people.length === 0) {
    return (
      <div className="empty-state">
        <strong>Nenhuma pessoa cadastrada.</strong>
        <p>Inclua a primeira pessoa para começar o controle da residência.</p>
      </div>
    )
  }

  return (
    <div className="table-wrap" role="region" aria-label="Pessoas cadastradas" tabIndex={0}>
      <table className="people-table">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Nome</th>
            <th scope="col">Idade</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.id}>
              <td className="table-id">#{person.id}</td>
              <td>
                <strong className="table-primary-text">{person.name}</strong>
              </td>
              <td>{person.age} anos</td>
              <td className="table-actions">
                <button
                  type="button"
                  className="button button--danger button--compact"
                  disabled={deletingPersonId === person.id}
                  onClick={() => onDeleteClick(person)}
                >
                  {deletingPersonId === person.id ? 'Excluindo...' : 'Excluir'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
