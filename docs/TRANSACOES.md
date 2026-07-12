# Módulo de Transações

## Objetivo

O módulo de transações permite registrar receitas e despesas associadas a uma pessoa cadastrada.

A interface está disponível no front-end pela rota `/transacoes` e consome os endpoints existentes da API.

## Campos

- `id`: identificador inteiro gerado automaticamente pelo banco.
- `description`: descrição da transação.
- `value`: valor positivo da transação.
- `type`: tipo da transação.
- `personId`: identificador da pessoa vinculada.
- `personName`: nome da pessoa retornado nas respostas.

## Tipos

```text
1 = Expense
2 = Income
```

Na interface:

```text
Expense = Despesa
Income  = Receita
```

## Fluxo da interface

1. A página carrega pessoas e transações ao abrir.
2. O formulário permite informar descrição, valor, tipo e pessoa.
3. Ao cadastrar com sucesso, a lista é recarregada.
4. A mensagem `Transação cadastrada com sucesso.` é exibida.
5. A listagem respeita a ordem retornada pela API.

## Validações

- A descrição é obrigatória.
- A descrição não pode conter apenas espaços.
- A descrição deve possuir no máximo 200 caracteres.
- O valor é obrigatório.
- O valor deve ser maior que zero.
- O valor aceita no máximo duas casas decimais na interface.
- O tipo da transação é obrigatório.
- A pessoa é obrigatória.

A descrição recebe `trim` antes do envio. O valor é enviado como número para a API e exibido em reais com `Intl.NumberFormat("pt-BR")`.

## Seleção de pessoa

A lista de pessoas é carregada por `GET /api/people`.

Cada opção mostra o nome e a idade da pessoa, e o valor enviado ao back-end é o `id`.

Caso não existam pessoas cadastradas, o formulário de transação não permite envio e exibe link para `/pessoas`.

## Regra para menores de idade

A proteção definitiva está no back-end.

No front-end, ao selecionar uma pessoa menor de 18 anos:

- a opção Receita fica indisponível;
- se Receita já estava selecionada, o tipo é alterado para Despesa;
- a orientação `Pessoas menores de 18 anos só podem possuir despesas.` é exibida.

Pessoas com exatamente 18 anos podem possuir receitas.

## Endpoints

```text
GET  /api/transactions
POST /api/transactions
```

Não há edição ou exclusão individual de transações no escopo atual.

## Cadastro

Requisição:

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

## Listagem

A listagem exibe:

- ID;
- descrição;
- pessoa;
- tipo;
- valor formatado em reais.

Receitas e despesas possuem identificação textual visível. Não há botões de editar ou excluir transações.

## Tratamento de erros

A interface trata:

- API indisponível;
- falha ao carregar pessoas;
- falha ao carregar transações;
- falha ao cadastrar;
- pessoa removida antes do envio;
- receita para menor rejeitada pela API.

As mensagens exibidas ao usuário são amigáveis e em português. Stack trace e mensagens técnicas brutas não são exibidas.

## Códigos HTTP

- `200`: listagem retornada com sucesso.
- `201`: transação cadastrada com sucesso.
- `400`: dados inválidos ou regra de negócio violada.
- `404`: pessoa não encontrada.
- `500`: erro inesperado sem exposição de stack trace.

## Exclusão em cascata

O relacionamento entre `Person` e `Transaction` foi configurado com exclusão em cascata.

Ao excluir uma pessoa por `DELETE /api/people/{id}`, todas as transações vinculadas a ela são removidas automaticamente pelo banco.

## Testes principais

O módulo possui testes automatizados para validações do serviço, endpoints HTTP, regra de idade, listagem com `personName`, formulário do front-end e listagem formatada em reais.