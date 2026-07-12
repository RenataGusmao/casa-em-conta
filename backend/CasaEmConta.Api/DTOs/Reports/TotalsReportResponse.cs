namespace CasaEmConta.Api.DTOs.Reports;

public class TotalsReportResponse
{
    public IReadOnlyList<PersonTotalsResponse> People { get; set; } = Array.Empty<PersonTotalsResponse>();

    public OverallTotalsResponse Overall { get; set; } = new();
}