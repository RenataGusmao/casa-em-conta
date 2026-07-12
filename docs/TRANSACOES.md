# Modulo de Transacoes

## Objetivo

O modulo de transacoes permite registrar receitas e despesas associadas a uma pessoa cadastrada.

Nesta etapa foi implementado somente o back-end. Ainda nao existe tela de transacoes no front-end.

## Campos

- `id`: identificador inteiro gerado automaticamente pelo banco.
- `description`: descricao da transacao.
- `value`: valor positivo da transacao.
- `type`: tipo da transacao.
- `personId`: identificador da pessoa vinculada.
- `personName`: nome da pessoa retornado nas respostas.

## Tipos

```text
1 = Expense
2 = Income
```

## Regras

- A descricao e obrigatoria.
- A descricao nao pode ser vazia nem conter apenas espacos.
- Espacos no inicio e no final da descricao sao removidos no cadastro.
- A descricao deve possuir no maximo 200 caracteres.
- O valor e obrigatorio e deve ser maior que zero.
- O valor nao e armazenado como negativo.
- O tipo da transacao e obrigatorio e deve ser `Expense` ou `Income`.
- A pessoa e obrigatoria e deve existir.
- Pessoas menores de 18 anos so podem possuir despesas.
- Pessoas com exatamente 18 anos podem possuir receitas e despesas.

## Endpoints

```text
GET  /api/transactions
POST /api/transactions
```

Nao foram implementados endpoints de edicao ou exclusao individual de transacoes.

## Cadastro

Requisicao:

```json
{
  "description": "Conta de energia",
  "value": 180.50,
  "type": 1,
  "personId": 1
}
```

Resposta:

```json
{
  "id": 1,
  "description": "Conta de energia",
  "value": 180.50,
  "type": 1,
  "personId": 1,
  "personName": "Ana Souza"
}
```

## Codigos HTTP

- `200`: listagem retornada com sucesso.
- `201`: transacao cadastrada com sucesso.
- `400`: dados invalidos ou regra de negocio violada.
- `404`: pessoa nao encontrada.
- `500`: erro inesperado sem exposicao de stack trace.

## Exclusao em cascata

O relacionamento entre `Person` e `Transaction` foi configurado com exclusao em cascata.

Ao excluir uma pessoa por `DELETE /api/people/{id}`, todas as transacoes vinculadas a ela sao removidas automaticamente pelo banco.

## Testes principais

Foram adicionados testes para:

- cadastro de despesa para pessoa menor;
- cadastro de despesa para pessoa adulta;
- cadastro de receita para pessoa adulta;
- cadastro de receita para pessoa com exatamente 18 anos;
- bloqueio de receita para pessoa menor de 18 anos;
- rejeicao de pessoa inexistente;
- validacoes de descricao, valor, tipo e pessoa;
- listagem com `personName`;
- endpoints de transacoes;
- exclusao em cascata ao excluir pessoa.
