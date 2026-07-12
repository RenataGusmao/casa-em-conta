# Relatório de totais

O back-end expõe um relatório consolidado de receitas, despesas e saldo por pessoa.

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

O relatório está disponível apenas na API nesta etapa.