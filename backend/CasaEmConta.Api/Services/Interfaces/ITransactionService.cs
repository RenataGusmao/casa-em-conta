using CasaEmConta.Api.DTOs.Transactions;

namespace CasaEmConta.Api.Services.Interfaces;

/// <summary>
/// Define as operações de consulta e cadastro de receitas e despesas.
/// </summary>
public interface ITransactionService
{
    /// <summary>
    /// Retorna as transações com o nome da pessoa vinculada.
    /// </summary>
    Task<IReadOnlyList<TransactionResponse>> GetAllAsync();

    /// <summary>
    /// Cadastra uma transação após validar valor, tipo, pessoa e regra de idade.
    /// </summary>
    Task<TransactionResponse> CreateAsync(CreateTransactionRequest request);
}