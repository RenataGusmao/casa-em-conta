# Casa em Conta

Casa em Conta e um sistema web para controle de gastos residenciais.

## Status

Esta etapa entrega a estrutura inicial do projeto, o back-end do modulo de pessoas e a interface web para cadastro, listagem e exclusao de pessoas. As funcionalidades de transacoes, totais e autenticacao ainda serao implementadas nas proximas etapas.

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

Para usar a tela de pessoas de ponta a ponta, mantenha a API e o front-end em execucao ao mesmo tempo.

## Modulo de pessoas

O modulo de pessoas esta disponivel na API e no front-end.

Endpoints:

```text
GET    /api/people
GET    /api/people/{id}
POST   /api/people
DELETE /api/people/{id}
```

Funcionalidades concluídas na interface:

- cadastro de pessoa;
- listagem de pessoas;
- exclusao com confirmacao;
- mensagens de sucesso e erro;
- estado vazio;
- estado de carregamento;
- tentativa novamente quando a API nao estiver disponivel.

Regras de validacao:

- `name` e obrigatorio, nao pode conter apenas espacos e possui limite de 150 caracteres.
- `age` e obrigatoria e deve estar entre 0 e 120 anos.
- O identificador e gerado automaticamente pelo banco.

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

Transacoes, totais, telas de edicao e demais regras de negocio ainda nao foram implementados.
