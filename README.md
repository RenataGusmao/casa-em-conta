# Casa em Conta

Casa em Conta e um sistema web para controle de gastos residenciais.

## Status

Esta etapa entrega a estrutura inicial do projeto, o modulo de pessoas completo e o back-end do modulo de transacoes. O front-end de transacoes, a consulta de totais e a autenticacao ainda serao implementados nas proximas etapas.

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

## Pre-requisitos

- .NET SDK 8
- Node.js
- npm

## Executar o back-end

```powershell
dotnet restore
dotnet tool restore
dotnet tool run dotnet-ef database update --project backend/CasaEmConta.Api/CasaEmConta.Api.csproj --startup-project backend/CasaEmConta.Api/CasaEmConta.Api.csproj
dotnet run --project backend/CasaEmConta.Api/CasaEmConta.Api.csproj --launch-profile https
```

Swagger:

```text
https://localhost:7154/swagger
```

Health check:

```text
https://localhost:7154/api/health
```

## Executar o front-end

Em outro terminal, execute:

```powershell
cd frontend
npm install
npm run dev
```

O front-end usa a variavel `VITE_API_BASE_URL`. Veja `frontend/.env.example`.

```env
VITE_API_BASE_URL=https://localhost:7154/api
```

A aplicacao abre em:

```text
http://localhost:5173
```

Rotas disponiveis:

```text
/         Inicio
/pessoas  Modulo de pessoas
```

## Modulo de pessoas

O modulo de pessoas esta disponivel na API e no front-end.

Endpoints:

```text
GET    /api/people
GET    /api/people/{id}
POST   /api/people
DELETE /api/people/{id}
```

Regras de validacao:

- `name` e obrigatorio, nao pode conter apenas espacos e possui limite de 150 caracteres.
- `age` e obrigatoria e deve estar entre 0 e 120 anos.
- O identificador e gerado automaticamente pelo banco.

## Modulo de transacoes

O back-end do modulo de transacoes esta disponivel na API. Ainda nao existe tela de transacoes no front-end.

Endpoints:

```text
GET  /api/transactions
POST /api/transactions
```

Tipos de transacao:

```text
1 = Expense
2 = Income
```

Regras principais:

- `description` e obrigatoria, recebe `trim` e possui limite de 200 caracteres.
- `value` e obrigatorio e deve ser maior que zero.
- `type` aceita somente `Expense` ou `Income`.
- `personId` e obrigatorio e deve apontar para uma pessoa existente.
- Pessoas menores de 18 anos so podem possuir despesas.
- Ao excluir uma pessoa, suas transacoes vinculadas sao removidas em cascata.

O banco SQLite local e criado em `backend/CasaEmConta.Api/casaemconta.db` ao aplicar as migrations. Arquivos `.db`, `.db-shm` e `.db-wal` sao ignorados pelo Git.

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

## Proximas etapas

Front-end de transacoes, consulta de totais, edicao e demais regras de negocio ainda nao foram implementados.
