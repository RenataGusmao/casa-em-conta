using System.ComponentModel.DataAnnotations;
using CasaEmConta.Api.Enums;

namespace CasaEmConta.Api.DTOs.Transactions;

public class CreateTransactionRequest
{
    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [MaxLength(200, ErrorMessage = "A descrição deve possuir no máximo 200 caracteres.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "O valor é obrigatório.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
    public decimal? Value { get; set; }

    [Required(ErrorMessage = "O tipo da transação é obrigatório.")]
    public TransactionType? Type { get; set; }

    [Required(ErrorMessage = "A pessoa é obrigatória.")]
    public int? PersonId { get; set; }
}

