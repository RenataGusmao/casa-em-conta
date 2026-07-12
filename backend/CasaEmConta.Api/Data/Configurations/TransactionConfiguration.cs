using CasaEmConta.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CasaEmConta.Api.Data.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("Transactions");
        builder.HasKey(transaction => transaction.Id);
        builder.Property(transaction => transaction.Id).ValueGeneratedOnAdd();
        builder.Property(transaction => transaction.Description).IsRequired().HasMaxLength(200);
        builder.Property(transaction => transaction.Value).IsRequired();
        builder.Property(transaction => transaction.Type).IsRequired();
        builder.Property(transaction => transaction.PersonId).IsRequired();

        builder
            .HasOne(transaction => transaction.Person)
            .WithMany(person => person.Transactions)
            .HasForeignKey(transaction => transaction.PersonId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
