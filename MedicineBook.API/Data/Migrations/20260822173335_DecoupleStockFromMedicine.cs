using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedicineBook.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class DecoupleStockFromMedicine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicineStocks_Medicines_MedicineId",
                table: "MedicineStocks");

            migrationBuilder.DropIndex(
                name: "IX_MedicineStocks_MedicineId",
                table: "MedicineStocks");

            migrationBuilder.DropColumn(
                name: "MedicineId",
                table: "MedicineStocks");

            migrationBuilder.AddColumn<string>(
                name: "MedicineName",
                table: "MedicineStocks",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MedicineName",
                table: "MedicineStocks");

            migrationBuilder.AddColumn<int>(
                name: "MedicineId",
                table: "MedicineStocks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_MedicineStocks_MedicineId",
                table: "MedicineStocks",
                column: "MedicineId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicineStocks_Medicines_MedicineId",
                table: "MedicineStocks",
                column: "MedicineId",
                principalTable: "Medicines",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
