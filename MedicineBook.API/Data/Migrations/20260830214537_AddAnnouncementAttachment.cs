using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedicineBook.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAnnouncementAttachment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AttachmentName",
                table: "Announcements",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AttachmentPath",
                table: "Announcements",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttachmentName",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "AttachmentPath",
                table: "Announcements");
        }
    }
}
