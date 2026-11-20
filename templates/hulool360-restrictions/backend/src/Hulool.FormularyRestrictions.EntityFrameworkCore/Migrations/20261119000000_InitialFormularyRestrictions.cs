using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hulool.FormularyRestrictions.EntityFrameworkCore.Migrations;

/// <summary>
/// Provider-neutral initial migration: no column types are hard-coded, so SQL Server, PostgreSQL and SQLite
/// each map the CLR types and lengths to their own column types.
/// </summary>
[DbContext(typeof(FormularyDbContext))]
[Migration("20261119000000_InitialFormularyRestrictions")]
public partial class InitialFormularyRestrictions : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "FormularyRestrictions",
            columns: t => new
            {
                Id = t.Column<string>(maxLength: 40, nullable: false),
                Generic = t.Column<string>(maxLength: 200, nullable: false),
                Status = t.Column<string>(maxLength: 80, nullable: false),
                Wording = t.Column<string>(nullable: false),
                Type = t.Column<string>(maxLength: 10, nullable: false),
                Conditions = t.Column<string>(maxLength: 200, nullable: false),
                Specialties = t.Column<string>(maxLength: 1000, nullable: false),
                Approved = t.Column<string>(maxLength: 60, nullable: false),
                Available = t.Column<string>(maxLength: 60, nullable: false),
                IsDeleted = t.Column<bool>(nullable: false),
                Source = t.Column<string>(maxLength: 10, nullable: false),
                UpdatedAtUtc = t.Column<DateTime>(nullable: false),
                UpdatedBy = t.Column<string>(maxLength: 120, nullable: true),
            },
            constraints: t => t.PrimaryKey("PK_FormularyRestrictions", x => x.Id));

        migrationBuilder.CreateTable(
            name: "FormularyItems",
            columns: t => new
            {
                ItemNo = t.Column<string>(maxLength: 40, nullable: false),
                Name = t.Column<string>(maxLength: 300, nullable: false),
                Uom = t.Column<string>(maxLength: 10, nullable: false),
                RestrictionId = t.Column<string>(maxLength: 40, nullable: true),
                QatariOnly = t.Column<bool>(nullable: false),
                QatariWording = t.Column<string>(maxLength: 4000, nullable: true),
                QatariExceptions = t.Column<string>(maxLength: 2000, nullable: true),
                IsDeleted = t.Column<bool>(nullable: false),
                Source = t.Column<string>(maxLength: 10, nullable: false),
                UpdatedAtUtc = t.Column<DateTime>(nullable: false),
                UpdatedBy = t.Column<string>(maxLength: 120, nullable: true),
            },
            constraints: t => t.PrimaryKey("PK_FormularyItems", x => x.ItemNo));

        migrationBuilder.CreateTable(
            name: "FormularyUsageEvents",
            columns: t => new
            {
                Id = t.Column<Guid>(nullable: false),
                AtUtc = t.Column<DateTime>(nullable: false),
                UserId = t.Column<string>(maxLength: 120, nullable: false),
                UserName = t.Column<string>(maxLength: 160, nullable: false),
                Type = t.Column<string>(maxLength: 10, nullable: false),
                Term = t.Column<string>(maxLength: 120, nullable: true),
                ZeroResult = t.Column<bool>(nullable: false),
                ItemNo = t.Column<string>(maxLength: 40, nullable: true),
                RestrictionType = t.Column<string>(maxLength: 20, nullable: true),
                Detail = t.Column<string>(maxLength: 200, nullable: true),
            },
            constraints: t => t.PrimaryKey("PK_FormularyUsageEvents", x => x.Id));

        migrationBuilder.CreateTable(
            name: "FormularyAuditLog",
            columns: t => new
            {
                Id = t.Column<Guid>(nullable: false),
                AtUtc = t.Column<DateTime>(nullable: false),
                UserId = t.Column<string>(maxLength: 120, nullable: false),
                UserName = t.Column<string>(maxLength: 160, nullable: false),
                Action = t.Column<string>(maxLength: 60, nullable: false),
                Kind = t.Column<string>(maxLength: 20, nullable: false),
                Key = t.Column<string>(maxLength: 60, nullable: false),
                Label = t.Column<string>(maxLength: 200, nullable: false),
            },
            constraints: t => t.PrimaryKey("PK_FormularyAuditLog", x => x.Id));

        migrationBuilder.CreateIndex(name: "IX_FormularyItems_RestrictionId", table: "FormularyItems", column: "RestrictionId");
        migrationBuilder.CreateIndex(name: "IX_FormularyUsageEvents_AtUtc", table: "FormularyUsageEvents", column: "AtUtc");
        migrationBuilder.CreateIndex(name: "IX_FormularyUsageEvents_UserId_AtUtc", table: "FormularyUsageEvents", columns: ["UserId", "AtUtc"]);
        migrationBuilder.CreateIndex(name: "IX_FormularyAuditLog_AtUtc", table: "FormularyAuditLog", column: "AtUtc");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "FormularyAuditLog");
        migrationBuilder.DropTable(name: "FormularyUsageEvents");
        migrationBuilder.DropTable(name: "FormularyItems");
        migrationBuilder.DropTable(name: "FormularyRestrictions");
    }
}
