# Módulo de Pessoas

## Objetivo

O módulo de pessoas permite cadastrar, listar, buscar e excluir moradores ou participantes associados aos gastos residenciais.

## Campos

- `id`: identificador inteiro gerado automaticamente pelo banco.
- `name`: nome da pessoa.
- `age`: idade da pessoa.

## Regras

- O nome é obrigatório.
- O nome não pode ser vazio nem conter apenas espaços.
- Espaços no início e no final do nome são removidos no cadastro.
- O nome deve possuir no máximo 150 caracteres.
- A idade é obrigatória e deve estar entre 0 e 120 anos.

As validações da interface melhoram a experiência, mas o back-end continua protegendo as regras para chamadas diretas à API.

## Endpoints

```text
GET    /api/people
GET    /api/people/{id}
POST   /api/people
DELETE /api/people/{id}
```

## Interface

A interface do módulo está disponível em:

```text
/pessoas
```

A página possui formulário de cadastro, listagem, confirmação de exclusão e mensagens de feedback.

## Fluxo de cadastro

1. Informar nome e idade.
2. Validar os campos na interface.
3. Enviar `POST /api/people`.
4. Recarregar a lista pela API.
5. Exibir mensagem de sucesso.
6. Limpar o formulário.

O nome é enviado com `trim`, então valores como `  Ana Souza  ` são salvos como `Ana Souza`.

## Fluxo de exclusão

1. Clicar em `Excluir` na listagem.
2. Confirmar ou cancelar no diálogo.
3. Enviar `DELETE /api/people/{id}` quando confirmado.
4. Recarregar a lista pela API.
5. Exibir mensagem de sucesso ou erro.

Quando a pessoa possui transações, elas também são removidas por exclusão em cascata.

## Estados da tela

- `Carregando pessoas...` durante a consulta inicial.
- `Nenhuma pessoa cadastrada.` quando a lista estiver vazia.
- Mensagem amigável se a API estiver indisponível.
- Botão `Tentar novamente` para repetir a busca.

## Respostas

Pessoa cadastrada:

```json
{
  "id": 1,
  "name": "Ana Souza",
  "age": 28
}
```

Pessoa não encontrada:

```json
{
  "message": "Pessoa não encontrada."
}
```

Dados inválidos:

```json
{
  "message": "O nome é obrigatório."
}
```

## Testes principais

O módulo possui testes automatizados para validações do serviço, endpoints HTTP, cadastro, listagem, busca, exclusão e regras de formulário no front-end.