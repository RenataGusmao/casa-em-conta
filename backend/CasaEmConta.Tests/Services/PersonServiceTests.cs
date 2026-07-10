using CasaEmConta.Api.Data;
using CasaEmConta.Api.DTOs.People;
using CasaEmConta.Api.Exceptions;
using CasaEmConta.Api.Models;
using CasaEmConta.Api.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace CasaEmConta.Tests.Services;

public class PersonServiceTests
{
    [Fact]
    public async Task CreateAsync_WithValidPerson_ReturnsCreatedPerson()
    {
        await using var database = await CreateDatabaseAsync();
        var service = new PersonService(database.Context);

        var person = await service.CreateAsync(new CreatePersonRequest
        {
            Name = "Ana Souza",
            Age = 28
        });

        Assert.True(person.Id > 0);
        Assert.Equal("Ana Souza", person.Name);
        Assert.Equal(28, person.Age);
    }

    [Fact]
    public async Task CreateAsync_TrimsPersonName()
    {
        await using var database = await CreateDatabaseAsync();
        var service = new PersonService(database.Context);

        var person = await service.CreateAsync(new CreatePersonRequest
        {
            Name = "  Ana Souza  ",
            Age = 28
        });

        Assert.Equal("Ana Souza", person.Name);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task CreateAsync_WithEmptyName_ThrowsDomainValidationException(string name)
    {
        await using var database = await CreateDatabaseAsync();
        var service = new PersonService(database.Context);

        var exception = await Assert.ThrowsAsync<DomainValidationException>(() =>
            service.CreateAsync(new CreatePersonRequest
            {
                Name = name,
                Age = 28
            }));

        Assert.Equal("O nome é obrigatório.", exception.Message);
    }

    [Fact]
    public async Task CreateAsync_WithMissingAge_ThrowsDomainValidationException()
    {
        await using var database = await CreateDatabaseAsync();
        var service = new PersonService(database.Context);

        var exception = await Assert.ThrowsAsync<DomainValidationException>(() =>
            service.CreateAsync(new CreatePersonRequest
            {
                Name = "Pedro"
            }));

        Assert.Equal("A idade é obrigatória.", exception.Message);
    }

    [Fact]
    public async Task CreateAsync_WithNegativeAge_ThrowsDomainValidationException()
    {
        await using var database = await CreateDatabaseAsync();
        var service = new PersonService(database.Context);

        var exception = await Assert.ThrowsAsync<DomainValidationException>(() =>
            service.CreateAsync(new CreatePersonRequest
            {
                Name = "Pedro",
                Age = -1
            }));

        Assert.Equal("A idade deve estar entre 0 e 120 anos.", exception.Message);
    }

    [Fact]
    public async Task CreateAsync_WithAgeGreaterThan120_ThrowsDomainValidationException()
    {
        await using var database = await CreateDatabaseAsync();
        var service = new PersonService(database.Context);

        var exception = await Assert.ThrowsAsync<DomainValidationException>(() =>
            service.CreateAsync(new CreatePersonRequest
            {
                Name = "Pedro",
                Age = 121
            }));

        Assert.Equal("A idade deve estar entre 0 e 120 anos.", exception.Message);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsPeopleOrderedByNameThenId()
    {
        await using var database = await CreateDatabaseAsync();
        database.Context.People.AddRange(
            new Person { Name = "Bruno", Age = 31 },
            new Person { Name = "Ana", Age = 28 },
            new Person { Name = "Ana", Age = 30 });
        await database.Context.SaveChangesAsync();

        var service = new PersonService(database.Context);

        var people = await service.GetAllAsync();

        Assert.Collection(
            people,
            person => Assert.Equal("Ana", person.Name),
            person => Assert.Equal("Ana", person.Name),
            person => Assert.Equal("Bruno", person.Name));
        Assert.True(people[0].Id < people[1].Id);
    }

    [Fact]
    public async Task GetByIdAsync_WhenPersonExists_ReturnsPerson()
    {
        await using var database = await CreateDatabaseAsync();
        var existing = new Person { Name = "Ana", Age = 28 };
        database.Context.People.Add(existing);
        await database.Context.SaveChangesAsync();

        var service = new PersonService(database.Context);

        var person = await service.GetByIdAsync(existing.Id);

        Assert.NotNull(person);
        Assert.Equal(existing.Id, person.Id);
        Assert.Equal("Ana", person.Name);
    }

    [Fact]
    public async Task GetByIdAsync_WhenPersonDoesNotExist_ReturnsNull()
    {
        await using var database = await CreateDatabaseAsync();
        var service = new PersonService(database.Context);

        var person = await service.GetByIdAsync(999);

        Assert.Null(person);
    }

    [Fact]
    public async Task DeleteAsync_WhenPersonExists_ReturnsTrue()
    {
        await using var database = await CreateDatabaseAsync();
        var existing = new Person { Name = "Ana", Age = 28 };
        database.Context.People.Add(existing);
        await database.Context.SaveChangesAsync();

        var service = new PersonService(database.Context);

        var deleted = await service.DeleteAsync(existing.Id);

        Assert.True(deleted);
        Assert.Empty(database.Context.People);
    }

    [Fact]
    public async Task DeleteAsync_WhenPersonDoesNotExist_ReturnsFalse()
    {
        await using var database = await CreateDatabaseAsync();
        var service = new PersonService(database.Context);

        var deleted = await service.DeleteAsync(999);

        Assert.False(deleted);
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
