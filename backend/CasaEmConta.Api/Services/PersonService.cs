using CasaEmConta.Api.Data;
using CasaEmConta.Api.DTOs.People;
using CasaEmConta.Api.Exceptions;
using CasaEmConta.Api.Models;
using CasaEmConta.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CasaEmConta.Api.Services;

/// <summary>
/// Aplica as regras de cadastro, consulta e exclusão de pessoas.
/// </summary>
public class PersonService : IPersonService
{
    private const int MaximumNameLength = 150;
    private const int MaximumAge = 120;

    private readonly AppDbContext _context;

    public PersonService(AppDbContext context)
    {
        _context = context;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<PersonResponse>> GetAllAsync()
    {
        return await _context.People
            .AsNoTracking()
            .OrderBy(person => person.Name)
            .ThenBy(person => person.Id)
            .Select(person => ToResponse(person))
            .ToListAsync();
    }

    /// <inheritdoc />
    public async Task<PersonResponse?> GetByIdAsync(int id)
    {
        return await _context.People
            .AsNoTracking()
            .Where(person => person.Id == id)
            .Select(person => ToResponse(person))
            .FirstOrDefaultAsync();
    }

    /// <inheritdoc />
    public async Task<PersonResponse> CreateAsync(CreatePersonRequest request)
    {
        var name = request.Name?.Trim() ?? string.Empty;

        // A validação é repetida no serviço porque chamadas diretas à API
        // podem ignorar as restrições aplicadas pela interface e pelos DTOs.
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainValidationException("O nome é obrigatório.");
        }

        if (name.Length > MaximumNameLength)
        {
            throw new DomainValidationException("O nome deve possuir no máximo 150 caracteres.");
        }

        if (!request.Age.HasValue)
        {
            throw new DomainValidationException("A idade é obrigatória.");
        }

        if (request.Age.Value is < 0 or > MaximumAge)
        {
            throw new DomainValidationException("A idade deve estar entre 0 e 120 anos.");
        }

        var person = new Person
        {
            Name = name,
            Age = request.Age.Value
        };

        _context.People.Add(person);
        await _context.SaveChangesAsync();

        return ToResponse(person);
    }

    /// <inheritdoc />
    public async Task<bool> DeleteAsync(int id)
    {
        var person = await _context.People.FindAsync(id);

        if (person is null)
        {
            return false;
        }

        _context.People.Remove(person);
        await _context.SaveChangesAsync();

        return true;
    }

    private static PersonResponse ToResponse(Person person)
    {
        return new PersonResponse
        {
            Id = person.Id,
            Name = person.Name,
            Age = person.Age
        };
    }
}