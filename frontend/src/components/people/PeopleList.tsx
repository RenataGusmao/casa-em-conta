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
        <p>Utilize o formulário acima para cadastrar a primeira pessoa.</p>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table className="people-table">
        <thead>
          <tr>
            <th scope="col">Identificador</th>
            <th scope="col">Nome</th>
            <th scope="col">Idade</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.id}>
              <td>{person.id}</td>
              <td>{person.name}</td>
              <td>{person.age}</td>
              <td>
                <button
                  type="button"
                  className="button button--danger"
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
