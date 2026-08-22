using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedicineBook.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBranchToStock : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Branch",
                table: "MedicineStocks",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Branch",
                table: "MedicineStocks");
        }
    }
}
