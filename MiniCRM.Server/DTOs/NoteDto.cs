using System.ComponentModel.DataAnnotations;

namespace MiniCRM.Server.DTOs
{
    public class NoteDto
    {
        [Required]
        public Guid CustomerId { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;
    }
}
