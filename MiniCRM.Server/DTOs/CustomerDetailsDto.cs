using MiniCRM.Server.Entities;

namespace MiniCRM.Server.DTOs
{
    public class CustomerDetailsDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Industry { get; set; } = string.Empty;

        public string Website { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public List<ContactDetailsDto> Contacts { get; set; } = [];

        public List<OpportunityDetailsDto> Opportunities { get; set; } = [];

        public List<NoteDetailsDto> Notes { get; set; } = [];
    }
}
