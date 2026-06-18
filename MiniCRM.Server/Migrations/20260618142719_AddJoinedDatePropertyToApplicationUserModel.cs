using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiniCRM.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddJoinedDatePropertyToApplicationUserModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "joined_date",
                table: "AspNetUsers",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "joined_date",
                table: "AspNetUsers");
        }
    }
}
