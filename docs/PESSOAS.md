# Modulo de Pessoas

## Objetivo

O modulo de pessoas permite cadastrar, listar, buscar e excluir moradores ou participantes associados aos gastos residenciais.

## Campos

- `id`: identificador inteiro gerado automaticamente pelo banco.
- `name`: nome da pessoa.
- `age`: idade da pessoa.

## Regras

- O nome e obrigatorio.
- O nome nao pode ser vazio nem conter apenas espacos.
- Espacos no inicio e no final do nome sao removidos no cadastro.
- O nome deve possuir no maximo 150 caracteres.
- A idade deve estar entre 0 e 120 anos. O limite de 120 anos e uma validacao da aplicacao para evitar valores claramente invalidos.

## Endpoints

```text
GET    /api/people
GET    /api/people/{id}
POST   /api/people
DELETE /api/people/{id}
```

## Respostas

Pessoa cadastrada:

```json
{
  "id": 1,
  "name": "Ana Souza",
  "age": 28
}
```

Pessoa nao encontrada:

```json
{
  "message": "Pessoa não encontrada."
}
```

Dados invalidos:

```json
{
  "message": "O nome é obrigatório."
}
```
