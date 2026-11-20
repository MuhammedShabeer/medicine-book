using Microsoft.EntityFrameworkCore;

namespace Hulool.FormularyRestrictions.EntityFrameworkCore;

/// <summary>Stand-alone context for the module's four tables. It can share the database (and connection string) of your main context.</summary>
public sealed class FormularyDbContext(DbContextOptions<FormularyDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder) => modelBuilder.ApplyFormularyRestrictionsModel();
}

public static class FormularyModelBuilderExtensions
{
    /// <summary>
    /// Adds the module's tables to any model. Use this inside your own DbContext's OnModelCreating
    /// if you prefer one context (then create the tables with your own migration).
    /// </summary>
    public static ModelBuilder ApplyFormularyRestrictionsModel(this ModelBuilder b)
    {
        b.Entity<FormularyItem>(e =>
        {
            e.ToTable("FormularyItems");
            e.HasKey(x => x.ItemNo);
            e.Property(x => x.ItemNo).HasMaxLength(40);
            e.Property(x => x.Name).HasMaxLength(300).IsRequired();
            e.Property(x => x.Uom).HasMaxLength(10).IsRequired();
            e.Property(x => x.RestrictionId).HasMaxLength(40);
            e.Property(x => x.QatariWording).HasMaxLength(4000);
            e.Property(x => x.QatariExceptions).HasMaxLength(2000);
            e.Property(x => x.Source).HasMaxLength(10).IsRequired();
            e.Property(x => x.UpdatedBy).HasMaxLength(120);
            e.HasIndex(x => x.RestrictionId);
        });
        b.Entity<FormularyRestriction>(e =>
        {
            e.ToTable("FormularyRestrictions");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(40);
            e.Property(x => x.Generic).HasMaxLength(200).IsRequired();
            e.Property(x => x.Status).HasMaxLength(80).IsRequired();
            e.Property(x => x.Wording).IsRequired();
            e.Property(x => x.Type).HasMaxLength(10).IsRequired();
            e.Property(x => x.Conditions).HasMaxLength(200).IsRequired();
            e.Property(x => x.Specialties).HasMaxLength(1000).IsRequired();
            e.Property(x => x.Approved).HasMaxLength(60).IsRequired();
            e.Property(x => x.Available).HasMaxLength(60).IsRequired();
            e.Property(x => x.Source).HasMaxLength(10).IsRequired();
            e.Property(x => x.UpdatedBy).HasMaxLength(120);
        });
        b.Entity<FormularyUsageEvent>(e =>
        {
            e.ToTable("FormularyUsageEvents");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).ValueGeneratedNever();
            e.Property(x => x.UserId).HasMaxLength(120).IsRequired();
            e.Property(x => x.UserName).HasMaxLength(160).IsRequired();
            e.Property(x => x.Type).HasMaxLength(10).IsRequired();
            e.Property(x => x.Term).HasMaxLength(120);
            e.Property(x => x.ItemNo).HasMaxLength(40);
            e.Property(x => x.RestrictionType).HasMaxLength(20);
            e.Property(x => x.Detail).HasMaxLength(200);
            e.HasIndex(x => x.AtUtc);
            e.HasIndex(x => new { x.UserId, x.AtUtc });
        });
        b.Entity<FormularyAuditEntry>(e =>
        {
            e.ToTable("FormularyAuditLog");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).ValueGeneratedNever();
            e.Property(x => x.UserId).HasMaxLength(120).IsRequired();
            e.Property(x => x.UserName).HasMaxLength(160).IsRequired();
            e.Property(x => x.Action).HasMaxLength(60).IsRequired();
            e.Property(x => x.Kind).HasMaxLength(20).IsRequired();
            e.Property(x => x.Key).HasMaxLength(60).IsRequired();
            e.Property(x => x.Label).HasMaxLength(200).IsRequired();
            e.HasIndex(x => x.AtUtc);
        });
        return b;
    }
}
