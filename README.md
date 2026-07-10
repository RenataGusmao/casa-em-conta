# Casa em Conta

Casa em Conta e um sistema web para controle de gastos residenciais.

## Status

Esta etapa entrega apenas a estrutura inicial do projeto: API, frontend, configuracoes basicas e teste automatizado inicial. As funcionalidades de dominio serao implementadas nas proximas etapas.

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

As entidades, cadastros, transacoes, totais, migrations e demais regras de negocio ainda nao foram implementados.
