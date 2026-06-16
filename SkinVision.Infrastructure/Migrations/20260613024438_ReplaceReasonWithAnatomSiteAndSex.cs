using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkinVision.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceReasonWithAnatomSiteAndSex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Reason",
                table: "Examinations");

            migrationBuilder.AddColumn<string>(
                name: "AnatomSite",
                table: "Examinations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Sex",
                table: "Examinations",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnatomSite",
                table: "Examinations");

            migrationBuilder.DropColumn(
                name: "Sex",
                table: "Examinations");

            migrationBuilder.AddColumn<string>(
                name: "Reason",
                table: "Examinations",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");
        }
    }
}
