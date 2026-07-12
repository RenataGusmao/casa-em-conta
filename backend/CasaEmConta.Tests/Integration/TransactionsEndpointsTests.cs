using System.Net;
using System.Net.Http.Json;
using CasaEmConta.Api.DTOs.People;
using CasaEmConta.Api.DTOs.Transactions;
using CasaEmConta.Api.Enums;
using CasaEmConta.Tests.Support;

namespace CasaEmConta.Tests.Integration;

public class TransactionsEndpointsTests
{
    [Fact]
    public async Task PostTransactions_WithValidRequest_ReturnsCreated()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();
        var person = await CreatePersonAsync(client, "Ana", 28);

        var response = await client.PostAsJsonAsync("/api/transactions", new CreateTransactionRequest
        {
            Description = "Conta de energia",
            Value = 180.50m,
            Type = TransactionType.Expense,
            PersonId = person.Id
        });
        var transaction = await response.Content.ReadFromJsonAsync<TransactionResponse>();

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(transaction);
        Assert.True(transaction.Id > 0);
        Assert.Equal("Conta de energia", transaction.Description);
        Assert.Equal("Ana", transaction.PersonName);
    }

    [Fact]
    public async Task GetTransactions_ReturnsOk()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/transactions");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task PostTransactions_WithIncomeForMinor_ReturnsBadRequest()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();
        var person = await CreatePersonAsync(client, "João", 17);

        var response = await client.PostAsJsonAsync("/api/transactions", new CreateTransactionRequest
        {
            Description = "Mesada",
            Value = 100,
            Type = TransactionType.Income,
            PersonId = person.Id
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task PostTransactions_WithUnknownPerson_ReturnsNotFound()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/transactions", new CreateTransactionRequest
        {
            Description = "Mercado",
            Value = 100,
            Type = TransactionType.Expense,
            PersonId = 999
        });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task PostTransactions_WithInvalidPayload_ReturnsBadRequest()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/transactions", new CreateTransactionRequest
        {
            Description = " ",
            Value = 0,
            Type = TransactionType.Expense,
            PersonId = 1
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetTransactions_ReturnsPersonName()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();
        var person = await CreatePersonAsync(client, "Ana", 28);
        await client.PostAsJsonAsync("/api/transactions", new CreateTransactionRequest
        {
            Description = "Mercado",
            Value = 100,
            Type = TransactionType.Expense,
            PersonId = person.Id
        });

        var transactions = await client.GetFromJsonAsync<List<TransactionResponse>>("/api/transactions");

        Assert.NotNull(transactions);
        Assert.Contains(transactions, transaction => transaction.PersonName == "Ana");
    }

    private static async Task<PersonResponse> CreatePersonAsync(HttpClient client, string name, int age)
    {
        var response = await client.PostAsJsonAsync("/api/people", new CreatePersonRequest
        {
            Name = name,
            Age = age
        });

        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<PersonResponse>())!;
    }
}
