using CasaEmConta.Api.Data;
using CasaEmConta.Api.DTOs.Reports;
using CasaEmConta.Api.Enums;
using CasaEmConta.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CasaEmConta.Api.Services;

public class ReportService : IReportService
{
    private readonly AppDbContext _context;

    public ReportService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TotalsReportResponse> GetTotalsAsync()
    {
        var people = await _context.People
            .AsNoTracking()
            .Include(person => person.Transactions)
            .OrderBy(person => person.Name)
            .ThenBy(person => person.Id)
            .ToListAsync();

        var personTotals = people
            .Select(person =>
            {
                var totalIncome = person.Transactions
                    .Where(transaction => transaction.Type == TransactionType.Income)
                    .Sum(transaction => transaction.Value);
                var totalExpense = person.Transactions
                    .Where(transaction => transaction.Type == TransactionType.Expense)
                    .Sum(transaction => transaction.Value);

                return new PersonTotalsResponse
                {
                    PersonId = person.Id,
                    PersonName = person.Name,
                    TotalIncome = totalIncome,
                    TotalExpense = totalExpense,
                    Balance = totalIncome - totalExpense
                };
            })
            .ToList();

        var overallIncome = personTotals.Sum(person => person.TotalIncome);
        var overallExpense = personTotals.Sum(person => person.TotalExpense);

        return new TotalsReportResponse
        {
            People = personTotals,
            Overall = new OverallTotalsResponse
            {
                TotalIncome = overallIncome,
                TotalExpense = overallExpense,
                Balance = overallIncome - overallExpense
            }
        };
    }
}