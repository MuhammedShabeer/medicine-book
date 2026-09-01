using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedicineBook.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMedicineAiOverview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AiOverview",
                table: "Medicines",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "AiOverviewGeneratedAt",
                table: "Medicines",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AiOverview",
                table: "Medicines");

            migrationBuilder.DropColumn(
                name: "AiOverviewGeneratedAt",
                table: "Medicines");
        }
    }
}
