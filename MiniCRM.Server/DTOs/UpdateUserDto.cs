using MiniCRM.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace MiniCRM.Server.DTOs
{
    public class UpdateUserDto : UpdateProfileDto
    {
        [Required]
        public string Role { get; set; } = string.Empty;

        [Required]
        public DateOnly JoinedDate { get; set; }

        [Required]
        public UserStatus Status { get; set; }
    }
}
