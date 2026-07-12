namespace CasaEmConta.Api.DTOs.Reports;

/// <summary>
/// Relatório de totais por pessoa e consolidado geral.
/// </summary>
public class TotalsReportResponse
{
    public IReadOnlyList<PersonTotalsResponse> People { get; set; } = Array.Empty<PersonTotalsResponse>();

    public OverallTotalsResponse Overall { get; set; } = new();
}