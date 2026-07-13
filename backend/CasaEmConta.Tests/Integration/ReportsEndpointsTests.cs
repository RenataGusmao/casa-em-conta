using System.Net;
using System.Net.Http.Json;
using CasaEmConta.Api.DTOs.People;
using CasaEmConta.Api.DTOs.Reports;
using CasaEmConta.Api.DTOs.Transactions;
using CasaEmConta.Api.Enums;
using CasaEmConta.Tests.Support;

namespace CasaEmConta.Tests.Integration;

public class ReportsEndpointsTests
{
    [Fact]
    public async Task GetReportsTotals_ReturnsOkAndExpectedStructure()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/reports/totals");
        var report = await response.Content.ReadFromJsonAsync<TotalsReportResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(report);
        Assert.NotNull(report.People);
        Assert.NotNull(report.Overall);
    }

    [Fact]
    public async Task GetReportsTotals_WithNoPeople_ReturnsEmptyPeopleAndZeroOverallTotals()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var report = await client.GetFromJsonAsync<TotalsReportResponse>("/api/reports/totals");

        Assert.NotNull(report);
        Assert.Empty(report.People);
        Assert.Equal(0m, report.Overall.TotalIncome);
        Assert.Equal(0m, report.Overall.TotalExpense);
        Assert.Equal(0m, report.Overall.Balance);
    }

    [Fact]
    public async Task GetReportsTotals_IncludesPersonWithoutTransactions()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();
        var person = await CreatePersonAsync(client, "Mariana Freitas", 28);

        var report = await client.GetFromJsonAsync<TotalsReportResponse>("/api/reports/totals");

        Assert.NotNull(report);
        var personTotals = Assert.Single(report.People);
        Assert.Equal(person.Id, personTotals.PersonId);
        Assert.Equal("Mariana Freitas", personTotals.PersonName);
        Assert.Equal(0m, personTotals.TotalIncome);
        Assert.Equal(0m, personTotals.TotalExpense);
        Assert.Equal(0m, personTotals.Balance);
    }

    [Fact]
    public async Task GetReportsTotals_ReturnsCalculatedValues()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();
        var mariana = await CreatePersonAsync(client, "Mariana Freitas", 28);
        var carlos = await CreatePersonAsync(client, "Carlos Lima", 35);
        await CreateTransactionAsync(client, mariana.Id, TransactionType.Income, 1000.50m);
        await CreateTransactionAsync(client, mariana.Id, TransactionType.Expense, 250.25m);
        await CreateTransactionAsync(client, carlos.Id, TransactionType.Expense, 100m);

        var report = await client.GetFromJsonAsync<TotalsReportResponse>("/api/reports/totals");

        Assert.NotNull(report);
        var marianaTotals = Assert.Single(report.People, person => person.PersonId == mariana.Id);
        var carlosTotals = Assert.Single(report.People, person => person.PersonId == carlos.Id);
        Assert.Equal(1000.50m, marianaTotals.TotalIncome);
        Assert.Equal(250.25m, marianaTotals.TotalExpense);
        Assert.Equal(750.25m, marianaTotals.Balance);
        Assert.Equal(0m, carlosTotals.TotalIncome);
        Assert.Equal(100m, carlosTotals.TotalExpense);
        Assert.Equal(-100m, carlosTotals.Balance);
        Assert.Equal(1000.50m, report.Overall.TotalIncome);
        Assert.Equal(350.25m, report.Overall.TotalExpense);
        Assert.Equal(650.25m, report.Overall.Balance);
    }

    [Fact]
    public async Task GetReportsTotals_ReflectsPersonDeletionCascade()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();
        var mariana = await CreatePersonAsync(client, "Mariana Freitas", 28);
        await CreateTransactionAsync(client, mariana.Id, TransactionType.Income, 1000m);
        await CreateTransactionAsync(client, mariana.Id, TransactionType.Expense, 250m);

        var deleteResponse = await client.DeleteAsync($"/api/people/{mariana.Id}");
        var report = await client.GetFromJsonAsync<TotalsReportResponse>("/api/reports/totals");

        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        Assert.NotNull(report);
        Assert.Empty(report.People);
        Assert.Equal(0m, report.Overall.TotalIncome);
        Assert.Equal(0m, report.Overall.TotalExpense);
        Assert.Equal(0m, report.Overall.Balance);
    }

    [Fact]
    public async Task GetReportsTotals_ReflectsNewTransactions()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();
        var mariana = await CreatePersonAsync(client, "Mariana Freitas", 28);
        await CreateTransactionAsync(client, mariana.Id, TransactionType.Income, 1000m);

        var firstReport = await client.GetFromJsonAsync<TotalsReportResponse>("/api/reports/totals");
        await CreateTransactionAsync(client, mariana.Id, TransactionType.Expense, 300m);
        var secondReport = await client.GetFromJsonAsync<TotalsReportResponse>("/api/reports/totals");

        Assert.NotNull(firstReport);
        Assert.NotNull(secondReport);
        Assert.Equal(1000m, firstReport.Overall.Balance);
        Assert.Equal(700m, secondReport.Overall.Balance);
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

    private static async Task<TransactionResponse> CreateTransactionAsync(
        HttpClient client,
        int personId,
        TransactionType type,
        decimal value)
    {
        var response = await client.PostAsJsonAsync("/api/transactions", new CreateTransactionRequest
        {
            Description = type == TransactionType.Income ? "Salário mensal" : "Conta de energia",
            Value = value,
            Type = type,
            PersonId = personId
        });

        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<TransactionResponse>())!;
    }
}