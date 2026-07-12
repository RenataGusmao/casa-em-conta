using CasaEmConta.Api.Enums;

namespace CasaEmConta.Api.DTOs.Transactions;

public class TransactionResponse
{
    public int Id { get; set; }

    public string Description { get; set; } = string.Empty;

    public decimal Value { get; set; }

    public TransactionType Type { get; set; }

    public int PersonId { get; set; }

    public string PersonName { get; set; } = string.Empty;
}
