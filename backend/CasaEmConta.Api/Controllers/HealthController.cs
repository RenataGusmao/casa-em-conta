using Microsoft.AspNetCore.Mvc;

namespace CasaEmConta.Api.Controllers;

/// <summary>
/// Endpoint simples para verificar disponibilidade da API.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    /// <summary>
    /// Retorna o estado básico da aplicação.
    /// </summary>
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "ok",
            application = "Casa em Conta"
        });
    }
}