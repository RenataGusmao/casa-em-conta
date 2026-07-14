# Testes

Este projeto usa testes automatizados para validar regras de negócio, integração da API e comportamentos críticos da interface. A meta desta etapa não é cobertura artificial de 100%, e sim proteção dos fluxos mais importantes.

## Estratégia

- O back-end cobre regras de domínio, endpoints HTTP, persistência relacional com SQLite em memória e tratamento global de erros.
- O front-end cobre formulários, listagens, totais, comportamento visível da página de totais e a fronteira de comunicação HTTP centralizada em `api.ts`.
- Os testes do front-end não usam a API real; chamadas externas são simuladas nas fronteiras de serviço ou `fetch`.
- Testes manuais continuam úteis para validar a aplicação completa com API, Vite e banco local em execução.

## Back-end

Tecnologias usadas:

- xUnit;
- Microsoft.AspNetCore.Mvc.Testing;
- Microsoft.Data.Sqlite;
- coverlet.collector.

Áreas cobertas:

- pessoas: criação, listagem, busca, exclusão, nome obrigatório, nome vazio, nome com espaços, trim, limite de caracteres, idade ausente, idade zero, idade negativa e idade acima de 120;
- transações: descrição obrigatória, espaços, trim, limite de caracteres, valor ausente, zero, negativo, tipo ausente, tipo inválido, pessoa ausente, pessoa inexistente, despesa para menor, receita bloqueada para menor, receita permitida aos 18 anos, listagem e nome da pessoa retornado;
- totais: banco vazio, pessoa sem transações, somente receita, somente despesa, receitas e despesas, saldo positivo, negativo e zero, total geral, ordenação e reflexo da exclusão em cascata;
- persistência: SQLite relacional em memória, exclusão em cascata e ausência de transações órfãs nos cenários cobertos;
- erros: exceções de domínio como 400, recurso inexistente como 404 e erro inesperado com resposta segura sem stack trace.

Executar testes:

```powershell
dotnet test CasaEmConta.sln
```

Executar cobertura:

```powershell
dotnet test CasaEmConta.sln --collect:"XPlat Code Coverage"
```

Os resultados de cobertura ficam em `backend/CasaEmConta.Tests/TestResults/`, que é ignorado pelo Git.

## Front-end

Tecnologias usadas:

- Vitest;
- React Testing Library;
- @testing-library/jest-dom;
- @testing-library/user-event;
- jsdom;
- @vitest/coverage-v8.

Áreas cobertas:

- `PersonForm`: campos, validações, idade zero, trim, envio e botão durante submissão;
- `TransactionForm`: campos, validações, valor decimal, pessoa obrigatória, tipo obrigatório, regras para menores, receita aos 18 anos e adulto, trim, enum e ID enviados;
- `PeopleList`, `TransactionsList` e modal de exclusão: conteúdo visível, estado vazio, ações e acessibilidade básica;
- `TotalsTable` e `OverallTotals`: pessoas, pessoa sem transações, receitas, despesas, saldo positivo, negativo com sinal, saldo zero e valores em reais;
- `TotalsPage`: carregamento, relatório exibido, erro amigável, retry, atualização manual e estado vazio com acesso a Pessoas;
- `api.ts`: sucesso com JSON, resposta 204, mensagem de erro da API, fallback amigável e falha de rede sem expor mensagem técnica.

Executar testes:

```powershell
cd frontend
npm test
```

Executar em modo observação:

```powershell
cd frontend
npm run test:watch
```

Executar cobertura:

```powershell
cd frontend
npm run test:coverage
```

Os resultados de cobertura ficam em `frontend/coverage/`, que é ignorado pelo Git.

## Build e lint

Front-end:

```powershell
cd frontend
npm run build
npm run lint
```

Back-end:

```powershell
dotnet build CasaEmConta.sln
```

## Testes manuais

Os testes manuais devem validar o sistema completo com API e front-end rodando ao mesmo tempo:

- cadastro, listagem, exclusão e cancelamento de exclusão de pessoas;
- despesa e receita para adulto;
- despesa para menor;
- bloqueio de receita para menor;
- receita permitida para pessoa com 18 anos;
- pessoa sem transações nos totais;
- saldo positivo, negativo e zero;
- total geral e atualização manual;
- persistência após reiniciar a API;
- mensagens amigáveis quando a API está indisponível e recuperação após tentar novamente.

## Limitações conhecidas

- Não há testes end-to-end com navegador real nesta etapa.
