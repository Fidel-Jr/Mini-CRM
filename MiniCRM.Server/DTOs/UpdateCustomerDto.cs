using System.ComponentModel.DataAnnotations;

namespace MiniCRM.Server.DTOs
{
    public class UpdateCustomerDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }
}
