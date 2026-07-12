using CasaEmConta.Api.Enums;

namespace CasaEmConta.Api.Models;

public class Transaction
{
    public int Id { get; set; }

    public string Description { get; set; } = string.Empty;

    public decimal Value { get; set; }

    public TransactionType Type { get; set; }

    public int PersonId { get; set; }

    public Person Person { get; set; } = null!;
}
