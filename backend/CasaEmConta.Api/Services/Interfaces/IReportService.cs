using CasaEmConta.Api.DTOs.Reports;

namespace CasaEmConta.Api.Services.Interfaces;

/// <summary>
/// Define a consulta consolidada de receitas, despesas e saldos.
/// </summary>
public interface IReportService
{
    /// <summary>
    /// Retorna receitas, despesas e saldo por pessoa, além do total geral.
    /// </summary>
    Task<TotalsReportResponse> GetTotalsAsync();
}