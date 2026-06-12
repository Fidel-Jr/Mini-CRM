using MiniCRM.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace MiniCRM.Server.DTOs
{
    public class OpportunityDto
    {
        [Required]
        public Guid CustomerId { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public decimal Value { get; set; }

        [Required]
        public OpportunityStage Stage { get; set; }
    }
}
