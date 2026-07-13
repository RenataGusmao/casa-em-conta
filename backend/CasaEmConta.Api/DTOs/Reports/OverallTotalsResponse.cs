namespace CasaEmConta.Api.DTOs.Reports;

/// <summary>
/// Totais consolidados de todas as pessoas do relatório.
/// </summary>
public class OverallTotalsResponse
{
    public decimal TotalIncome { get; set; }

    public decimal TotalExpense { get; set; }

    public decimal Balance { get; set; }
}