namespace MiniCRM.Server.DTOs
{
    public class NoteDetailsDto
    {
        public Guid CustomerId { get; set; }

        public string Content { get; set; } = string.Empty;
    }
}
