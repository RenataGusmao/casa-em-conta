using CasaEmConta.Api.DTOs.People;

namespace CasaEmConta.Api.Services.Interfaces;

/// <summary>
/// Define as operações de cadastro, consulta e exclusão de pessoas.
/// </summary>
public interface IPersonService
{
    /// <summary>
    /// Retorna as pessoas cadastradas em ordem estável por nome e identificador.
    /// </summary>
    Task<IReadOnlyList<PersonResponse>> GetAllAsync();

    /// <summary>
    /// Busca uma pessoa pelo identificador informado.
    /// </summary>
    Task<PersonResponse?> GetByIdAsync(int id);

    /// <summary>
    /// Cadastra uma pessoa após validar nome e idade também no back-end.
    /// </summary>
    Task<PersonResponse> CreateAsync(CreatePersonRequest request);

    /// <summary>
    /// Remove a pessoa e permite que o relacionamento apague suas transações em cascata.
    /// </summary>
    Task<bool> DeleteAsync(int id);
}