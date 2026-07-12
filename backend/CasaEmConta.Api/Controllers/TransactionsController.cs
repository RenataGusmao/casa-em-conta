using CasaEmConta.Api.DTOs.Transactions;
using CasaEmConta.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CasaEmConta.Api.Controllers;

/// <summary>
/// Endpoints para consulta e cadastro de transações.
/// </summary>
[ApiController]
[Route("api/transactions")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    /// <summary>
    /// Lista as transações cadastradas com o nome da pessoa vinculada.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<TransactionResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<TransactionResponse>>> GetAll()
    {
        var transactions = await _transactionService.GetAllAsync();

        return Ok(transactions);
    }

    /// <summary>
    /// Cadastra uma receita ou despesa respeitando a regra de idade da pessoa.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(TransactionResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TransactionResponse>> Create(CreateTransactionRequest request)
    {
        var transaction = await _transactionService.CreateAsync(request);

        return CreatedAtAction(nameof(GetAll), new { id = transaction.Id }, transaction);
    }
}