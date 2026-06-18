using MiniCRM.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace MiniCRM.Server.DTOs
{
    public class UpdateUserDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        [Required]
        public DateOnly JoinedDate { get; set; }
        public IFormFile? ProfileImage { get; set; }
        [Required]
        public UserStatus Status { get; set; }
    }
}
