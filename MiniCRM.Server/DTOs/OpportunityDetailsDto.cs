namespace MiniCRM.Server.DTOs
{
    public class OpportunityDetailsDto
    {
        public int CustomerId { get; set; }

        public string Title { get; set; } = string.Empty;

        public decimal Value { get; set; }

        public string Stage { get; set; } = string.Empty;
    }
}
