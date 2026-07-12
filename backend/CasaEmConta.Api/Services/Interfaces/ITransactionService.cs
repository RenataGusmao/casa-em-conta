using CasaEmConta.Api.DTOs.Transactions;

namespace CasaEmConta.Api.Services.Interfaces;

public interface ITransactionService
{
    Task<IReadOnlyList<TransactionResponse>> GetAllAsync();

    Task<TransactionResponse> CreateAsync(CreateTransactionRequest request);
}
