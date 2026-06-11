using Microsoft.AspNetCore.Identity;

namespace SalesPilot.Server.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;
        public string? ProfileImage { get; set; }
    }
}
