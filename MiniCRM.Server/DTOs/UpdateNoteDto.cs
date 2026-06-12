using System.ComponentModel.DataAnnotations;

namespace MiniCRM.Server.DTOs
{
    public class UpdateNoteDto
    {
        [Required]
        public string Content { get; set; } = string.Empty;
    }
}
