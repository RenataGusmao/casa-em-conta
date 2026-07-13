# Documentação

Esta pasta reúne documentos complementares do Casa em Conta.

- `PESSOAS.md`: regras e fluxo do módulo de pessoas.
- `TRANSACOES.md`: regras e fluxo do módulo de transações.
- `TOTAIS.md`: contrato e interface da consulta de totais.
- `TESTES.md`: estratégia, comandos e escopo dos testes automatizados e manuais.

## Configuração local

O front-end possui `frontend/.env.example` versionado como referência. O arquivo `frontend/.env` é local, fica fora do Git e pode ser criado quando for necessário sobrescrever a URL da API.

Sem `.env`, o front-end usa `http://localhost:5077/api` como fallback para execução local.

## Persistência

O banco SQLite é criado localmente pelas migrations e começa vazio. Os registros cadastrados ficam no arquivo local do banco e continuam disponíveis após reiniciar a aplicação. O arquivo .db não é versionado.
