using CasaEmConta.Api.DTOs.Reports;

namespace CasaEmConta.Api.Services.Interfaces;

public interface IReportService
{
    Task<TotalsReportResponse> GetTotalsAsync();
}