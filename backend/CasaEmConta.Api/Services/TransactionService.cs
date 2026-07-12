using CasaEmConta.Api.Data;
using CasaEmConta.Api.DTOs.Transactions;
using CasaEmConta.Api.Enums;
using CasaEmConta.Api.Exceptions;
using CasaEmConta.Api.Models;
using CasaEmConta.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CasaEmConta.Api.Services;

/// <summary>
/// Aplica as regras de cadastro e consulta de transações.
/// </summary>
public class TransactionService : ITransactionService
{
    private const int MaximumDescriptionLength = 200;
    private const int AdultAge = 18;

    private readonly AppDbContext _context;

    public TransactionService(AppDbContext context)
    {
        _context = context;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<TransactionResponse>> GetAllAsync()
    {
        return await _context.Transactions
            .AsNoTracking()
            .Include(transaction => transaction.Person)
            .OrderByDescending(transaction => transaction.Id)
            .Select(transaction => ToResponse(transaction))
            .ToListAsync();
    }

    /// <inheritdoc />
    public async Task<TransactionResponse> CreateAsync(CreateTransactionRequest request)
    {
        var description = request.Description?.Trim() ?? string.Empty;

        // A API mantém as validações de negócio mesmo quando o front-end já
        // bloqueia entradas inválidas para melhorar a experiência do usuário.
        if (string.IsNullOrWhiteSpace(description))
        {
            throw new DomainValidationException("A descrição é obrigatória.");
        }

        if (description.Length > MaximumDescriptionLength)
        {
            throw new DomainValidationException("A descrição deve possuir no máximo 200 caracteres.");
        }

        if (!request.Value.HasValue || request.Value.Value <= 0)
        {
            throw new DomainValidationException("O valor deve ser maior que zero.");
        }

        if (!request.Type.HasValue)
        {
            throw new DomainValidationException("O tipo da transação é obrigatório.");
        }

        if (!Enum.IsDefined(typeof(TransactionType), request.Type.Value))
        {
            throw new DomainValidationException("O tipo da transação é inválido.");
        }

        if (!request.PersonId.HasValue || request.PersonId.Value <= 0)
        {
            throw new DomainValidationException("A pessoa é obrigatória.");
        }

        var person = await _context.People.FirstOrDefaultAsync(person => person.Id == request.PersonId.Value);

        if (person is null)
        {
            throw new NotFoundException("Pessoa não encontrada.");
        }

        if (person.Age < AdultAge && request.Type.Value == TransactionType.Income)
        {
            throw new DomainValidationException("Pessoas menores de 18 anos só podem possuir despesas.");
        }

        var transaction = new Transaction
        {
            Description = description,
            Value = request.Value.Value,
            Type = request.Type.Value,
            PersonId = person.Id,
            Person = person
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return ToResponse(transaction);
    }

    private static TransactionResponse ToResponse(Transaction transaction)
    {
        return new TransactionResponse
        {
            Id = transaction.Id,
            Description = transaction.Description,
            Value = transaction.Value,
            Type = transaction.Type,
            PersonId = transaction.PersonId,
            PersonName = transaction.Person.Name
        };
    }
}