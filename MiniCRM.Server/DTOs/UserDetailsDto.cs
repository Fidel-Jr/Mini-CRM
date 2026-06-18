using System.ComponentModel.DataAnnotations;

namespace MiniCRM.Server.DTOs
{
    public class UserDetailsDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string ProfileImage { get; set; }
    }
}
