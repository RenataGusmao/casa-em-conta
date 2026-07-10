using Microsoft.AspNetCore.Mvc;

namespace CasaEmConta.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
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
