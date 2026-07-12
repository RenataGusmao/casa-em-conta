using CasaEmConta.Api.Data;
using CasaEmConta.Api.DTOs.Transactions;
using CasaEmConta.Api.Enums;
using CasaEmConta.Api.Exceptions;
using CasaEmConta.Api.Models;
using CasaEmConta.Api.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace CasaEmConta.Tests.Services;

public class TransactionServiceTests
{
    [Fact]
    public async Task CreateAsync_CreatesExpenseForMinorPerson()
    {
        await using var database = await CreateDatabaseAsync();
        var minor = await AddPersonAsync(database.Context, "João", 12);
        var service = new TransactionService(database.Context);

        var transaction = await service.CreateAsync(new CreateTransactionRequest
        {
            Description = "Material escolar",
            Value = 80,
            Type = TransactionType.Expense,
            PersonId = minor.Id
        });

        Assert.True(transaction.Id > 0);
        Assert.Equal("Material escolar", transaction.Description);
        Assert.Equal(TransactionType.Expense, transaction.Type);
        Assert.Equal(minor.Id, transaction.PersonId);
        Assert.Equal("João", transaction.PersonName);
    }

    [Fact]
    public async Task CreateAsync_CreatesExpenseForAdultPerson()
    {
        await using var database = await CreateDatabaseAsync();
        var adult = await AddPersonAsync(database.Context, "Ana", 28);
        var service = new TransactionService(database.Context);

        var transaction = await service.CreateAsync(new CreateTransactionRequest
        {
            Description = "Conta de energia",
            Value = 180.50m,
            Type = TransactionType.Expense,
            PersonId = adult.Id
        });

        Assert.Equal(TransactionType.Expense, transaction.Type);
        Assert.Equal(180.50m, transaction.Value);
    }

    [Fact]
    public async Task CreateAsync_CreatesIncomeForAdultPerson()
    {
        await using var database = await CreateDatabaseAsync();
        var adult = await AddPersonAsync(database.Context, "Ana", 28);
        var service = new TransactionService(database.Context);

        var transaction = await service.CreateAsync(new CreateTransactionRequest
        {
            Description = "Salário",
            Value = 2500,
            Type = TransactionType.Income,
            PersonId = adult.Id
        });

        Assert.Equal(TransactionType.Income, transaction.Type);
    }

    [Fact]
    public async Task CreateAsync_CreatesIncomeForPersonWithExactly18Years()
    {
        await using var database = await CreateDatabaseAsync();
        var adult = await AddPersonAsync(database.Context, "Maria", 18);
        var service = new TransactionService(database.Context);

        var transaction = await service.CreateAsync(new CreateTransactionRequest
        {
            Description = "Bolsa",
            Value = 500,
            Type = TransactionType.Income,
            PersonId = adult.Id
        });

        Assert.Equal(TransactionType.Income, transaction.Type);
    }

    [Fact]
    public async Task CreateAsync_RejectsIncomeForMinorPerson()
    {
        await using var database = await CreateDatabaseAsync();
        var minor = await AddPersonAsync(database.Context, "João", 17);
        var service = new TransactionService(database.Context);

        var exception = await Assert.ThrowsAsync<DomainValidationException>(() =>
            service.CreateAsync(new CreateTransactionRequest
            {
                Description = "Mesada",
                Value = 100,
                Type = TransactionType.Income,
                PersonId = minor.Id
            }));

        Assert.Equal("Pessoas menores de 18 anos só podem possuir despesas.", exception.Message);
    }

    [Fact]
    public async Task CreateAsync_RejectsUnknownPerson()
    {
        await using var database = await CreateDatabaseAsync();
        var service = new TransactionService(database.Context);

        var exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            service.CreateAsync(CreateValidRequest(personId: 999)));

        Assert.Equal("Pessoa não encontrada.", exception.Message);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task CreateAsync_RejectsEmptyDescription(string description)
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Ana", 28);
        var service = new TransactionService(database.Context);

        var exception = await Assert.ThrowsAsync<DomainValidationException>(() =>
            service.CreateAsync(CreateValidRequest(person.Id, description)));

        Assert.Equal("A descrição é obrigatória.", exception.Message);
    }

    [Fact]
    public async Task CreateAsync_TrimsDescription()
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Ana", 28);
        var service = new TransactionService(database.Context);

        var transaction = await service.CreateAsync(CreateValidRequest(person.Id, "  Mercado  "));

        Assert.Equal("Mercado", transaction.Description);
    }

    [Fact]
    public async Task CreateAsync_RejectsDescriptionLongerThan200Characters()
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Ana", 28);
        var service = new TransactionService(database.Context);

        var exception = await Assert.ThrowsAsync<DomainValidationException>(() =>
            service.CreateAsync(CreateValidRequest(person.Id, new string('A', 201))));

        Assert.Equal("A descrição deve possuir no máximo 200 caracteres.", exception.Message);
    }

    [Theory]
    [InlineData("0")]
    [InlineData("-1")]
    public async Task CreateAsync_RejectsValueLessThanOrEqualToZero(string valueText)
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Ana", 28);
        var service = new TransactionService(database.Context);
        var value = decimal.Parse(valueText, System.Globalization.CultureInfo.InvariantCulture);

        var exception = await Assert.ThrowsAsync<DomainValidationException>(() =>
            service.CreateAsync(CreateValidRequest(person.Id, value: value)));

        Assert.Equal("O valor deve ser maior que zero.", exception.Message);
    }

    [Fact]
    public async Task CreateAsync_RejectsMissingValue()
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Ana", 28);
        var service = new TransactionService(database.Context);

        var exception = await Assert.ThrowsAsync<DomainValidationException>(() =>
            service.CreateAsync(CreateValidRequest(person.Id, value: null)));

        Assert.Equal("O valor deve ser maior que zero.", exception.Message);
    }

    [Fact]
    public async Task CreateAsync_RejectsMissingType()
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Ana", 28);
        var service = new TransactionService(database.Context);

        var exception = await Assert.ThrowsAsync<DomainValidationException>(() =>
            service.CreateAsync(CreateValidRequest(person.Id, type: null)));

        Assert.Equal("O tipo da transação é obrigatório.", exception.Message);
    }

    [Fact]
    public async Task CreateAsync_RejectsInvalidType()
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Ana", 28);
        var service = new TransactionService(database.Context);

        var exception = await Assert.ThrowsAsync<DomainValidationException>(() =>
            service.CreateAsync(CreateValidRequest(person.Id, type: (TransactionType)999)));

        Assert.Equal("O tipo da transação é inválido.", exception.Message);
    }

    [Fact]
    public async Task CreateAsync_RejectsMissingPersonId()
    {
        await using var database = await CreateDatabaseAsync();
        var service = new TransactionService(database.Context);

        var exception = await Assert.ThrowsAsync<DomainValidationException>(() =>
            service.CreateAsync(CreateValidRequest(personId: null)));

        Assert.Equal("A pessoa é obrigatória.", exception.Message);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsTransactionsWithPersonNameOrderedByDescendingId()
    {
        await using var database = await CreateDatabaseAsync();
        var person = await AddPersonAsync(database.Context, "Ana", 28);
        var service = new TransactionService(database.Context);
        var first = await service.CreateAsync(CreateValidRequest(person.Id, "Primeira"));
        var second = await service.CreateAsync(CreateValidRequest(person.Id, "Segunda"));

        var transactions = await service.GetAllAsync();

        Assert.Collection(
            transactions,
            transaction =>
            {
                Assert.Equal(second.Id, transaction.Id);
                Assert.Equal("Ana", transaction.PersonName);
            },
            transaction => Assert.Equal(first.Id, transaction.Id));
    }

    private static CreateTransactionRequest CreateValidRequest(
        int? personId,
        string description = "Mercado",
        decimal? value = 10,
        TransactionType? type = TransactionType.Expense)
    {
        return new CreateTransactionRequest
        {
            Description = description,
            Value = value,
            Type = type,
            PersonId = personId
        };
    }

    private static async Task<Person> AddPersonAsync(AppDbContext context, string name, int age)
    {
        var person = new Person { Name = name, Age = age };
        context.People.Add(person);
        await context.SaveChangesAsync();

        return person;
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
