using MiniCRM.Server.Enums;

namespace MiniCRM.Server.Entities
{
    public class Opportunity
    {
        public Guid Id { get; set; }

        public Guid CustomerId { get; set; }

        public string Title { get; set; }
            = string.Empty;

        public decimal Value { get; set; }

        public OpportunityStage Stage { get; set; }

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;

        public Customer Customer { get; set; }
            = null!;
    }
}
