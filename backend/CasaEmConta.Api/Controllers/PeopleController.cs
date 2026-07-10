using CasaEmConta.Api.DTOs.People;
using CasaEmConta.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CasaEmConta.Api.Controllers;

[ApiController]
[Route("api/people")]
public class PeopleController : ControllerBase
{
    private readonly IPersonService _personService;

    public PeopleController(IPersonService personService)
    {
        _personService = personService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<PersonResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<PersonResponse>>> GetAll()
    {
        var people = await _personService.GetAllAsync();

        return Ok(people);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(PersonResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PersonResponse>> GetById(int id)
    {
        var person = await _personService.GetByIdAsync(id);

        if (person is null)
        {
            return NotFound(new { message = "Pessoa não encontrada." });
        }

        return Ok(person);
    }

    [HttpPost]
    [ProducesResponseType(typeof(PersonResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PersonResponse>> Create(CreatePersonRequest request)
    {
        var person = await _personService.CreateAsync(request);

        return CreatedAtAction(nameof(GetById), new { id = person.Id }, person);
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _personService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new { message = "Pessoa não encontrada." });
        }

        return NoContent();
    }
}
