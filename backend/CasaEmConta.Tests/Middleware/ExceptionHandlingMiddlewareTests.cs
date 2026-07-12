using System.Net;
using System.Text.Json;
using CasaEmConta.Api.Exceptions;
using CasaEmConta.Api.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;

namespace CasaEmConta.Tests.Middleware;

public class ExceptionHandlingMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_WhenDomainValidationExceptionOccurs_ReturnsBadRequest()
    {
        var middleware = CreateMiddleware(_ => throw new DomainValidationException("Dados inválidos."));
        var context = CreateHttpContext();

        await middleware.InvokeAsync(context);

        var response = await ReadJsonResponseAsync(context);
        Assert.Equal(HttpStatusCode.BadRequest, (HttpStatusCode)context.Response.StatusCode);
        Assert.Equal("Dados inválidos.", response.GetProperty("message").GetString());
    }

    [Fact]
    public async Task InvokeAsync_WhenNotFoundExceptionOccurs_ReturnsNotFound()
    {
        var middleware = CreateMiddleware(_ => throw new NotFoundException("Registro não encontrado."));
        var context = CreateHttpContext();

        await middleware.InvokeAsync(context);

        var response = await ReadJsonResponseAsync(context);
        Assert.Equal(HttpStatusCode.NotFound, (HttpStatusCode)context.Response.StatusCode);
        Assert.Equal("Registro não encontrado.", response.GetProperty("message").GetString());
    }

    [Fact]
    public async Task InvokeAsync_WhenUnexpectedExceptionOccurs_ReturnsSafeMessageWithoutStackTrace()
    {
        var middleware = CreateMiddleware(_ => throw new InvalidOperationException("Detalhe técnico sensível."));
        var context = CreateHttpContext();

        await middleware.InvokeAsync(context);

        context.Response.Body.Position = 0;
        using var reader = new StreamReader(context.Response.Body);
        var body = await reader.ReadToEndAsync();

        Assert.Equal(HttpStatusCode.InternalServerError, (HttpStatusCode)context.Response.StatusCode);
        Assert.Contains("Ocorreu um erro inesperado.", body);
        Assert.DoesNotContain("Detalhe técnico sensível", body);
        Assert.DoesNotContain("InvalidOperationException", body);
        Assert.DoesNotContain("at ", body);
    }

    private static ExceptionHandlingMiddleware CreateMiddleware(RequestDelegate next)
    {
        return new ExceptionHandlingMiddleware(
            next,
            NullLogger<ExceptionHandlingMiddleware>.Instance);
    }

    private static DefaultHttpContext CreateHttpContext()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        return context;
    }

    private static async Task<JsonElement> ReadJsonResponseAsync(HttpContext context)
    {
        context.Response.Body.Position = 0;
        return await JsonSerializer.DeserializeAsync<JsonElement>(context.Response.Body);
    }
}