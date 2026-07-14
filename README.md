# Casa em Conta

Casa em Conta é um sistema web para controle de gastos residenciais. A aplicação permite cadastrar pessoas, registrar receitas e despesas, consultar totais por pessoa e visualizar o total geral da residência.

## Funcionalidades

- Cadastro, listagem e exclusão de pessoas.
- Cadastro de transações associadas a pessoas previamente cadastradas.
- Restrição de receitas para pessoas menores de 18 anos.
- Exclusão em cascata das transações ao excluir uma pessoa.
- Consulta de totais por pessoa, incluindo pessoas sem transações.
- Total geral de receitas, despesas e saldo líquido.
- Persistência local em SQLite.
- Tratamento global de erros na API.
- Testes automatizados no back-end e no front-end.

## Tecnologias

- .NET 8 com C#
- ASP.NET Core Web API
- Entity Framework Core
- SQLite
- React com TypeScript
- Vite
- React Router DOM
- xUnit
- Vitest e React Testing Library

## Estrutura

```text
casa-em-conta/
|-- backend/
|   |-- CasaEmConta.Api/
|   `-- CasaEmConta.Tests/
|-- frontend/
|-- docs/
|-- CasaEmConta.sln
|-- README.md
|-- .gitignore
`-- .editorconfig
```

## Pré-requisitos

- .NET SDK 8
- Node.js
- npm

## Executar o back-end

Abra um terminal na raiz do projeto.

```bash
dotnet tool restore
dotnet restore
dotnet tool run dotnet-ef database update --project backend/CasaEmConta.Api --startup-project backend/CasaEmConta.Api
dotnet run --project backend/CasaEmConta.Api
```

API:

```text
http://localhost:5077/api
```

Swagger:

```text
http://localhost:5077/swagger
```

Health check:

```text
http://localhost:5077/api/health
```

## Executar o front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Front-end:

```text
http://localhost:5173
```

### Configuração do front-end

O arquivo `.env` é local e não é enviado ao repositório.

Para criar o arquivo a partir do exemplo, execute dentro da pasta `frontend`:

Windows — PowerShell:

```powershell
Copy-Item .env.example .env
```

Linux, macOS ou Git Bash:

```bash
cp .env.example .env
```

Ou crie manualmente:

```env
VITE_API_BASE_URL=http://localhost:5077/api
```

Caso o `.env` não seja criado, o front-end utiliza `http://localhost:5077/api` como endereço padrão da API no ambiente local.

Em outro ambiente, ajuste `VITE_API_BASE_URL` para apontar para a URL correta da API.

Para usar a aplicação, mantenha API e front-end rodando ao mesmo tempo.

## Rotas do front-end

```text
/            Início
/pessoas     Módulo de pessoas
/transacoes  Módulo de transações
/totais      Consulta de totais
```

## Endpoints principais

Pessoas:

```text
GET    /api/people
GET    /api/people/{id}
POST   /api/people
DELETE /api/people/{id}
```

Transações:

```text
GET  /api/transactions
POST /api/transactions
```

Totais:

```text
GET /api/reports/totals
```

## Regras principais

Pessoas:

- `name` é obrigatório, recebe `trim`, não pode conter apenas espaços e possui limite de 150 caracteres.
- `age` é obrigatória e deve estar entre 0 e 120 anos.

Transações:

- `description` é obrigatória, recebe `trim` e possui limite de 200 caracteres.
- `value` é obrigatório e deve ser maior que zero.
- `type` aceita `Expense` ou `Income`.
- `personId` deve apontar para uma pessoa existente.
- Pessoas menores de 18 anos só podem possuir despesas.
- Pessoas com exatamente 18 anos podem possuir receitas.
- Ao excluir uma pessoa, suas transações vinculadas são removidas em cascata.

Totais:

- Pessoas sem transações aparecem com totais zerados.
- Receitas (`Income`) compõem `totalIncome`.
- Despesas (`Expense`) compõem `totalExpense`.
- Saldo (`balance`) é calculado como receita menos despesa.
- O consolidado geral fica em `overall`.

## Persistência

O banco SQLite local é criado vazio em `backend/CasaEmConta.Api/casaemconta.db` ao aplicar as migrations. O arquivo do banco não é versionado; depois de criado, os registros cadastrados permanecem disponíveis mesmo após encerrar e iniciar novamente a aplicação. Arquivos `.db`, `.db-shm` e `.db-wal` são ignorados pelo Git.

## Testes

Back-end:

```bash
dotnet test CasaEmConta.sln
```

Cobertura do back-end:

```bash
dotnet test CasaEmConta.sln --collect:"XPlat Code Coverage"
```

Front-end:

```bash
cd frontend
npm test
```

Cobertura do front-end:

```bash
cd frontend
npm run test:coverage
```

Build e lint do front-end:

```bash
cd frontend
npm run build
npm run lint
```

Detalhes da estratégia de testes estão em `docs/TESTES.md`.

## Decisões técnicas

- A API centraliza erros esperados e inesperados em um middleware para evitar exposição de stack trace.
- As regras de negócio são validadas no back-end mesmo quando o front-end já impede entradas inválidas.
- O relatório de totais parte da tabela de pessoas para incluir pessoas sem transações.
- O front-end centraliza chamadas HTTP em `api.ts` e formatação monetária em `utils/currency.ts`.

## Documentação complementar

- `docs/PESSOAS.md`
- `docs/TRANSACOES.md`
- `docs/TOTAIS.md`
- `docs/TESTES.md`