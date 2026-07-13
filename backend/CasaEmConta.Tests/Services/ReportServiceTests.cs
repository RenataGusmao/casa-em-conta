using CasaEmConta.Api.Data;
using CasaEmConta.Api.Enums;
using CasaEmConta.Api.Models;
using CasaEmConta.Api.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace CasaEmConta.Tests.Services;

public class ReportServiceTests
{
    [Fact]
    public async Task GetTotalsAsync_WithNoPeople_ReturnsEmptyPeopleAndZeroOverallTotals()
    {
        await using var database = await CreateDatabaseAsync();
        var service = new ReportService(database.Context);

        var report = await service.GetTotalsAsync();

        Assert.Empty(report.People);
        Assert.Equal(0m, report.Overall.TotalIncome);
        Assert.Equal(0m, report.Overall.TotalExpense);
        Assert.Equal(0m, report.Overall.Balance);
    }

    [Fact]
    public async Task GetTotalsAsync_IncludesPersonWithoutTransactionsWithZeroTotals()
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Mariana Freitas", 28);
        var service = new ReportService(database.Context);

        var report = await service.GetTotalsAsync();

        var personTotals = Assert.Single(report.People);
        Assert.Equal(person.Id, personTotals.PersonId);
        Assert.Equal("Mariana Freitas", personTotals.PersonName);
        Assert.Equal(0m, personTotals.TotalIncome);
        Assert.Equal(0m, personTotals.TotalExpense);
        Assert.Equal(0m, personTotals.Balance);
    }

    [Fact]
    public async Task GetTotalsAsync_WithOnlyIncome_CalculatesPositiveBalance()
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Mariana Freitas", 28);
        await AddTransactionAsync(database.Context, person.Id, TransactionType.Income, 1000.25m);
        await AddTransactionAsync(database.Context, person.Id, TransactionType.Income, 200.10m);
        var service = new ReportService(database.Context);

        var report = await service.GetTotalsAsync();

        var personTotals = Assert.Single(report.People);
        Assert.Equal(1200.35m, personTotals.TotalIncome);
        Assert.Equal(0m, personTotals.TotalExpense);
        Assert.Equal(1200.35m, personTotals.Balance);
    }

    [Fact]
    public async Task GetTotalsAsync_WithOnlyExpense_CalculatesNegativeBalance()
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Mariana Freitas", 28);
        await AddTransactionAsync(database.Context, person.Id, TransactionType.Expense, 75.40m);
        await AddTransactionAsync(database.Context, person.Id, TransactionType.Expense, 24.60m);
        var service = new ReportService(database.Context);

        var report = await service.GetTotalsAsync();

        var personTotals = Assert.Single(report.People);
        Assert.Equal(0m, personTotals.TotalIncome);
        Assert.Equal(100.00m, personTotals.TotalExpense);
        Assert.Equal(-100.00m, personTotals.Balance);
    }

    [Fact]
    public async Task GetTotalsAsync_WithMixedTransactions_CalculatesZeroBalance()
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Mariana Freitas", 28);
        await AddTransactionAsync(database.Context, person.Id, TransactionType.Income, 150m);
        await AddTransactionAsync(database.Context, person.Id, TransactionType.Expense, 50m);
        await AddTransactionAsync(database.Context, person.Id, TransactionType.Expense, 100m);
        var service = new ReportService(database.Context);

        var report = await service.GetTotalsAsync();

        var personTotals = Assert.Single(report.People);
        Assert.Equal(150m, personTotals.TotalIncome);
        Assert.Equal(150m, personTotals.TotalExpense);
        Assert.Equal(0m, personTotals.Balance);
    }

    [Fact]
    public async Task GetTotalsAsync_CalculatesOverallTotalsAcrossPeople()
    {
        await using var database = await CreateDatabaseAsync();
        var mariana = await AddPersonAsync(database.Context, "Mariana Freitas", 28);
        var carlos = await AddPersonAsync(database.Context, "Carlos Lima", 35);
        await AddTransactionAsync(database.Context, mariana.Id, TransactionType.Income, 1000m);
        await AddTransactionAsync(database.Context, mariana.Id, TransactionType.Expense, 250m);
        await AddTransactionAsync(database.Context, carlos.Id, TransactionType.Income, 500m);
        await AddTransactionAsync(database.Context, carlos.Id, TransactionType.Expense, 750m);
        var service = new ReportService(database.Context);

        var report = await service.GetTotalsAsync();

        Assert.Equal(1500m, report.Overall.TotalIncome);
        Assert.Equal(1000m, report.Overall.TotalExpense);
        Assert.Equal(500m, report.Overall.Balance);
    }

    [Fact]
    public async Task GetTotalsAsync_OrdersPeopleByNameThenId()
    {
        await using var database = await CreateDatabaseAsync();
        var firstAnaRibeiro = await AddPersonAsync(database.Context, "Ana Ribeiro", 28);
        var carlos = await AddPersonAsync(database.Context, "Carlos Lima", 35);
        var secondAnaRibeiro = await AddPersonAsync(database.Context, "Ana Ribeiro", 40);
        var service = new ReportService(database.Context);

        var report = await service.GetTotalsAsync();

        Assert.Collection(
            report.People,
            person => Assert.Equal(firstAnaRibeiro.Id, person.PersonId),
            person => Assert.Equal(secondAnaRibeiro.Id, person.PersonId),
            person => Assert.Equal(carlos.Id, person.PersonId));
    }

    [Fact]
    public async Task GetTotalsAsync_DistinguishesIncomeAndExpenseTypes()
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Mariana Freitas", 28);
        await AddTransactionAsync(database.Context, person.Id, TransactionType.Income, 300m);
        await AddTransactionAsync(database.Context, person.Id, TransactionType.Expense, 100m);
        var service = new ReportService(database.Context);

        var report = await service.GetTotalsAsync();

        var personTotals = Assert.Single(report.People);
        Assert.Equal(300m, personTotals.TotalIncome);
        Assert.Equal(100m, personTotals.TotalExpense);
        Assert.Equal(200m, personTotals.Balance);
    }

    [Fact]
    public async Task GetTotalsAsync_UsesDecimalCalculations()
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Mariana Freitas", 28);
        await AddTransactionAsync(database.Context, person.Id, TransactionType.Income, 0.30m);
        await AddTransactionAsync(database.Context, person.Id, TransactionType.Expense, 0.10m);
        var service = new ReportService(database.Context);

        var report = await service.GetTotalsAsync();

        var personTotals = Assert.Single(report.People);
        Assert.Equal(0.30m, personTotals.TotalIncome);
        Assert.Equal(0.10m, personTotals.TotalExpense);
        Assert.Equal(0.20m, personTotals.Balance);
        Assert.Equal(0.20m, report.Overall.Balance);
    }

    private static async Task<Person> AddPersonAsync(AppDbContext context, string name, int age)
    {
        var person = new Person { Name = name, Age = age };
        context.People.Add(person);
        await context.SaveChangesAsync();

        return person;
    }

    private static async Task<Transaction> AddTransactionAsync(
        AppDbContext context,
        int personId,
        TransactionType type,
        decimal value)
    {
        var transaction = new Transaction
        {
            Description = type == TransactionType.Income ? "Salário mensal" : "Conta de energia",
            Value = value,
            Type = type,
            PersonId = personId
        };
        context.Transactions.Add(transaction);
        await context.SaveChangesAsync();

        return transaction;
    }

    private static async Task<TestDatabase> CreateDatabaseAsync()
    {
        var connection = new SqliteConnection("DataSource=:memory:");
        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        var context = new AppDbContext(options);
        await context.Database.EnsureCreatedAsync();

        return new TestDatabase(connection, context);
    }

    private sealed class TestDatabase : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        public TestDatabase(SqliteConnection connection, AppDbContext context)
        {
            _connection = connection;
            Context = context;
        }

        public AppDbContext Context { get; }

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }
}