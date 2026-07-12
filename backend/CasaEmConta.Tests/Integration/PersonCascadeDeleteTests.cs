using System.Net.Http.Json;
using CasaEmConta.Api.Data;
using CasaEmConta.Api.DTOs.People;
using CasaEmConta.Api.DTOs.Transactions;
using CasaEmConta.Api.Enums;
using CasaEmConta.Tests.Support;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CasaEmConta.Tests.Integration;

public class PersonCascadeDeleteTests
{
    [Fact]
    public async Task DeletePerson_RemovesLinkedTransactions()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();
        var personResponse = await client.PostAsJsonAsync("/api/people", new CreatePersonRequest
        {
            Name = "Ana",
            Age = 28
        });
        personResponse.EnsureSuccessStatusCode();
        var person = (await personResponse.Content.ReadFromJsonAsync<PersonResponse>())!;

        var expenseResponse = await client.PostAsJsonAsync("/api/transactions", new CreateTransactionRequest
        {
            Description = "Mercado",
            Value = 100,
            Type = TransactionType.Expense,
            PersonId = person.Id
        });
        expenseResponse.EnsureSuccessStatusCode();

        var incomeResponse = await client.PostAsJsonAsync("/api/transactions", new CreateTransactionRequest
        {
            Description = "Salário",
            Value = 1000,
            Type = TransactionType.Income,
            PersonId = person.Id
        });
        incomeResponse.EnsureSuccessStatusCode();

        var deleteResponse = await client.DeleteAsync($"/api/people/{person.Id}");

        deleteResponse.EnsureSuccessStatusCode();
        using var scope = factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var remainingTransactions = await context.Transactions.CountAsync();

        Assert.Equal(0, remainingTransactions);
    }
}
