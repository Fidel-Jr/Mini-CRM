namespace MiniCRM.Server.Entities
{
    public class Note
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public string Content { get; set; }
            = string.Empty;

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;

        public Customer Customer { get; set; }
            = null!;
    }
}
