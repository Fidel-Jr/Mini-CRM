namespace MiniCRM.Server.Entities
{
    public class Contact
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public string FirstName { get; set; }
            = string.Empty;

        public string LastName { get; set; }
            = string.Empty;

        public string Email { get; set; }
            = string.Empty;

        public string Position { get; set; }
            = string.Empty;

        public Customer Customer { get; set; }
            = null!;
    }
}
