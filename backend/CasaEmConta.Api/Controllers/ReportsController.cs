using CasaEmConta.Api.DTOs.Reports;
using CasaEmConta.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CasaEmConta.Api.Controllers;

[ApiController]
[Route("api/reports")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("totals")]
    [ProducesResponseType(typeof(TotalsReportResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<TotalsReportResponse>> GetTotals()
    {
        var totals = await _reportService.GetTotalsAsync();

        return Ok(totals);
    }
}