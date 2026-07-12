# Relatório de totais

O sistema expõe um relatório consolidado de receitas, despesas e saldo por pessoa no back-end e uma tela dedicada no front-end.

## Endpoint

```text
GET /api/reports/totals
```

Resposta HTTP esperada:

```text
200 OK
```

## Estrutura da resposta

```json
{
  "people": [
    {
      "personId": 1,
      "personName": "Ana",
      "totalIncome": 1000.0,
      "totalExpense": 250.0,
      "balance": 750.0
    }
  ],
  "overall": {
    "totalIncome": 1000.0,
    "totalExpense": 250.0,
    "balance": 750.0
  }
}
```

## Regras

- Pessoas sem transações aparecem no relatório com totais zerados.
- Pessoas são ordenadas por nome e, em caso de empate, por identificador.
- `totalIncome` soma apenas transações do tipo `Income`.
- `totalExpense` soma apenas transações do tipo `Expense`.
- `balance` é calculado como `totalIncome - totalExpense`.
- `overall` consolida os totais de todas as pessoas retornadas.

## Interface

A tela fica disponível em:

```text
/totais
```

Fluxo da interface:

- ao abrir a página, o front-end busca `GET /reports/totals` usando `VITE_API_BASE_URL`;
- enquanto a consulta está em andamento, exibe `Carregando totais...`;
- quando há pessoas, exibe uma tabela com Pessoa, Receitas, Despesas e Saldo;
- ao final, exibe o Total geral em um painel separado;
- o botão `Atualizar` refaz a consulta manualmente e fica desabilitado durante o carregamento;
- quando não há pessoas, exibe o estado vazio com link para `/pessoas`;
- quando a API está indisponível ou retorna erro, exibe mensagem em português e permite tentar novamente.

## Formatação monetária

Todos os valores são formatados com `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })` por meio do utilitário `frontend/src/utils/currency.ts`.

## Saldos

A interface diferencia saldo positivo, negativo e zerado com classe visual e texto explícito, sem depender apenas de cor.