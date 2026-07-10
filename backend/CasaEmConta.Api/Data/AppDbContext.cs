using CasaEmConta.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CasaEmConta.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Person> People => Set<Person>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Person>(entity =>
        {
            entity.ToTable("People");
            entity.HasKey(person => person.Id);
            entity.Property(person => person.Id).ValueGeneratedOnAdd();
            entity.Property(person => person.Name).IsRequired().HasMaxLength(150);
            entity.Property(person => person.Age).IsRequired();
        });
    }
}
