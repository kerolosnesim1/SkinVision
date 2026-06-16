using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkinVision.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHeatmapPathToPrediction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HeatmapPath",
                table: "Predictions",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeatmapPath",
                table: "Predictions");
        }
    }
}
