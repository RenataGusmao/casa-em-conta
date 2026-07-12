# Casa em Conta

Casa em Conta é um sistema web para controle de gastos residenciais.

## Status

Esta etapa entrega a estrutura inicial do projeto, o módulo de pessoas completo, o módulo de transações com back-end e front-end e a consulta de totais com back-end e front-end. A autenticação ainda será implementada nas próximas etapas.

## Tecnologias

- .NET 8 com C#
- ASP.NET Core Web API
- Entity Framework Core com SQLite
- React com TypeScript
- Vite
- React Router DOM
- xUnit

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

```powershell
dotnet restore
dotnet tool restore
dotnet tool run dotnet-ef database update --project backend/CasaEmConta.Api/CasaEmConta.Api.csproj --startup-project backend/CasaEmConta.Api/CasaEmConta.Api.csproj
dotnet run --project backend/CasaEmConta.Api
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

Em outro terminal, execute:

```powershell
cd frontend
npm install
npm run dev
```

O front-end usa a variável `VITE_API_BASE_URL`. Veja `frontend/.env.example`.

```env
VITE_API_BASE_URL=http://localhost:5077/api
```

Para usar a aplicação, mantenha API e front-end rodando ao mesmo tempo.

A aplicação abre em:

```text
http://localhost:5173
```

Rotas disponíveis:

```text
/            Início
/pessoas     Módulo de pessoas
/transacoes  Módulo de transações
/totais      Consulta de totais
```

## Módulo de pessoas

O módulo de pessoas está disponível na API e no front-end.

Endpoints:

```text
GET    /api/people
GET    /api/people/{id}
POST   /api/people
DELETE /api/people/{id}
```

Regras de validação:

- `name` é obrigatório, não pode conter apenas espaços e possui limite de 150 caracteres.
- `age` é obrigatória e deve estar entre 0 e 120 anos.
- O identificador é gerado automaticamente pelo banco.

## Módulo de transações

O módulo de transações está disponível na API e no front-end pela rota `/transacoes`.

Endpoints:

```text
GET  /api/transactions
POST /api/transactions
```

Campos do formulário:

- descrição;
- valor;
- tipo, com as opções Despesa e Receita;
- pessoa vinculada.

Tipos de transação:

```text
1 = Expense
2 = Income
```

Regras principais:

- `description` é obrigatória, recebe `trim` e possui limite de 200 caracteres.
- `value` é obrigatório e deve ser maior que zero.
- `type` aceita somente `Expense` ou `Income`.
- `personId` é obrigatório e deve apontar para uma pessoa existente.
- Pessoas menores de 18 anos só podem possuir despesas.
- Pessoas com 18 anos podem possuir receitas.
- Ao excluir uma pessoa, suas transações vinculadas são removidas em cascata.

No front-end, a opção Receita fica indisponível ao selecionar uma pessoa menor de 18 anos. A listagem exibe identificador, descrição, pessoa, tipo e valor formatado em reais.

## Relatório de totais

A consulta de totais está disponível na API e no front-end pela rota `/totais`.

Endpoint:

```text
GET /api/reports/totals
```

Dados exibidos no front-end:

- receitas, despesas e saldo por pessoa;
- pessoas sem transações com valores zerados;
- receitas gerais, despesas gerais e saldo líquido geral;
- valores formatados em reais;
- botão `Atualizar` para refazer a consulta manualmente;
- estado vazio quando não há pessoas cadastradas;
- mensagem amigável quando a API está indisponível.

Para usar a tela de totais, mantenha API e front-end rodando simultaneamente. Detalhes adicionais estão em `docs/TOTAIS.md`.

O banco SQLite local é criado em `backend/CasaEmConta.Api/casaemconta.db` ao aplicar as migrations. Arquivos `.db`, `.db-shm` e `.db-wal` são ignorados pelo Git.

## Testes

Back-end:

```powershell
dotnet test
```

Front-end:

```powershell
cd frontend
npm run build
npm run lint
```

## Próximas etapas

Edição de transações, autenticação e demais evoluções ainda não foram implementadas.