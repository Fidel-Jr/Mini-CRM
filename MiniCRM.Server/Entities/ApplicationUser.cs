using Microsoft.AspNetCore.Identity;
using MiniCRM.Server.Enums;

namespace MiniCRM.Server.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;
        public string? ProfileImage { get; set; }

        public UserStatus Status { get; set; } = UserStatus.Active;

        public DateOnly JoinedDate { get; set; }
    }
}
