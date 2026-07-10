# Casa em Conta

Casa em Conta e um sistema web para controle de gastos residenciais.

## Status

Esta etapa entrega a estrutura inicial do projeto e o back-end do modulo de pessoas. As funcionalidades de transacoes, totais, autenticacao e interface de cadastro ainda serao implementadas nas proximas etapas.

## Tecnologias

- .NET 8 com C#
- ASP.NET Core Web API
- Entity Framework Core preparado para uso futuro com SQLite
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

## Modulo de pessoas

O modulo de pessoas esta disponivel na API.

Endpoints:

```text
GET    /api/people
GET    /api/people/{id}
POST   /api/people
DELETE /api/people/{id}
```

Exemplo de cadastro:

```json
{
  "name": "Ana Souza",
  "age": 28
}
```

Regras de validacao:

- `name` e obrigatorio, nao pode conter apenas espacos e possui limite de 150 caracteres.
- `age` deve estar entre 0 e 120 anos.
- O identificador e gerado automaticamente pelo banco.

O banco SQLite local e criado em `backend/CasaEmConta.Api/casaemconta.db` ao aplicar as migrations. Arquivos `.db`, `.db-shm` e `.db-wal` sao ignorados pelo Git.

## Executar o front-end

```powershell
cd frontend
npm install
npm run dev
```

O front-end usa a variavel `VITE_API_BASE_URL`. Veja `frontend/.env.example`.

## Testes

```powershell
dotnet test
```

## Proximas etapas

Transacoes, totais, telas de cadastro e demais regras de negocio ainda nao foram implementados.
