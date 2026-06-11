namespace SalesPilot.Server.Entities
{
    public class Customer
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Industry { get; set; } = string.Empty;

        public string Website { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;

        public ICollection<Contact> Contacts { get; set; }
            = new List<Contact>();

        public ICollection<Opportunity> Opportunities { get; set; }
            = new List<Opportunity>();

        public ICollection<Note> Notes { get; set; }
            = new List<Note>();
    }
}
