using System.ComponentModel.DataAnnotations;

namespace MiniCRM.Server.DTOs
{
    public class UpdateContactDto
    {
        [Required]
        public int CustomerId { get; set; }
        [Required]
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
        [Required]
        public string Position { get; set; } = string.Empty;
    }
}
