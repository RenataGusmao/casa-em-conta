using System.Net;
using System.Text;
using System.Net.Http.Json;
using CasaEmConta.Api.DTOs.People;
using CasaEmConta.Tests.Support;

namespace CasaEmConta.Tests.Integration;

public class PeopleEndpointsTests
{
    [Fact]
    public async Task PostPeople_WithValidRequest_ReturnsCreated()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/people", new CreatePersonRequest
        {
            Name = "  Ana Souza  ",
            Age = 28
        });
        var person = await response.Content.ReadFromJsonAsync<PersonResponse>();

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(person);
        Assert.True(person.Id > 0);
        Assert.Equal("Ana Souza", person.Name);
        Assert.Equal(28, person.Age);
    }

    [Fact]
    public async Task GetPeople_ReturnsOk()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/people");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetPeopleById_WhenPersonDoesNotExist_ReturnsNotFound()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/people/999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeletePeople_WhenPersonExists_ReturnsNoContent()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();
        var createResponse = await client.PostAsJsonAsync("/api/people", new CreatePersonRequest
        {
            Name = "Ana Souza",
            Age = 28
        });
        var person = await createResponse.Content.ReadFromJsonAsync<PersonResponse>();

        var deleteResponse = await client.DeleteAsync($"/api/people/{person!.Id}");

        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task PostPeople_WithInvalidRequest_ReturnsBadRequest()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/people", new CreatePersonRequest
        {
            Name = "   ",
            Age = 28
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Theory]
    [InlineData("{}")]
    [InlineData("""{"name":null,"age":28}""")]
    [InlineData("""{"name":"","age":28}""")]
    [InlineData("""{"name":"   ","age":28}""")]
    public async Task PostPeople_WithInvalidName_ReturnsBadRequest(string json)
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();
        using var content = CreateJsonContent(json);

        var response = await client.PostAsync("/api/people", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task PostPeople_WithNameLongerThan150Characters_ReturnsBadRequest()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();
        var name = new string('A', 151);
        using var content = CreateJsonContent($$"""{"name":"{{name}}","age":28}""");

        var response = await client.PostAsync("/api/people", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task PostPeople_WithoutAge_ReturnsBadRequest()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();
        using var content = CreateJsonContent("""{"name":"Ana Souza"}""");

        var response = await client.PostAsync("/api/people", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private static StringContent CreateJsonContent(string json)
    {
        return new StringContent(json, Encoding.UTF8, "application/json");
    }
}
