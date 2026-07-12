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

## Interface

A interface do modulo esta disponivel em:

```text
/pessoas
```

A pagina possui formulario de cadastro, listagem, confirmacao de exclusao e mensagens de feedback.

## Fluxo de cadastro

1. Informar nome e idade.
2. Validar os campos na interface.
3. Enviar `POST /api/people`.
4. Recarregar a lista pela API.
5. Exibir mensagem de sucesso.
6. Limpar o formulario.

O nome e enviado com `trim`, entao valores como `  Ana Souza  ` sao salvos como `Ana Souza`.

## Validacoes da interface

- Nome obrigatorio.
- Nome nao pode conter apenas espacos.
- Nome deve possuir no maximo 150 caracteres.
- Idade obrigatoria.
- Idade deve ser numero inteiro.
- Idade deve estar entre 0 e 120 anos.

As validacoes da interface melhoram a experiencia, mas o back-end continua validando as regras.

## Fluxo de exclusao

1. Clicar em `Excluir` na listagem.
2. Confirmar ou cancelar no dialogo.
3. Enviar `DELETE /api/people/{id}` quando confirmado.
4. Recarregar a lista pela API.
5. Exibir mensagem de sucesso ou erro.

A mensagem de confirmacao informa que transacoes vinculadas tambem serao removidas quando esse modulo existir.

## Estados da tela

- `Carregando pessoas...` durante a consulta inicial.
- `Nenhuma pessoa cadastrada.` quando a lista estiver vazia.
- Mensagem amigavel se a API estiver indisponivel.
- Botao `Tentar novamente` para repetir a busca.

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
