using CasaEmConta.Api.DTOs.People;

namespace CasaEmConta.Api.Services.Interfaces;

public interface IPersonService
{
    Task<IReadOnlyList<PersonResponse>> GetAllAsync();

    Task<PersonResponse?> GetByIdAsync(int id);

    Task<PersonResponse> CreateAsync(CreatePersonRequest request);

    Task<bool> DeleteAsync(int id);
}
