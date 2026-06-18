using System.ComponentModel.DataAnnotations;

namespace MiniCRM.Server.DTOs
{
    public class UpdateProfileDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Password { get; set; }

        public IFormFile? ProfileImage { get; set; }
    }
}
