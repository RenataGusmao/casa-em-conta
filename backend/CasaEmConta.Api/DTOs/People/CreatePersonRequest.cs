using System.ComponentModel.DataAnnotations;

namespace CasaEmConta.Api.DTOs.People;

public class CreatePersonRequest
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [MaxLength(150, ErrorMessage = "O nome deve possuir no máximo 150 caracteres.")]
    public string Name { get; set; } = string.Empty;

    // O limite de 120 anos evita valores claramente inválidos nesta etapa.
    [Required(ErrorMessage = "A idade é obrigatória.")]
    [Range(0, 120, ErrorMessage = "A idade deve estar entre 0 e 120 anos.")]
    public int? Age { get; set; }
}
