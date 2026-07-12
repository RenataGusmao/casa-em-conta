namespace CasaEmConta.Api.DTOs.Reports;

public class OverallTotalsResponse
{
    public decimal TotalIncome { get; set; }

    public decimal TotalExpense { get; set; }

    public decimal Balance { get; set; }
}