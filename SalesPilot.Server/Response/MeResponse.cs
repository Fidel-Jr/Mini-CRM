namespace SalesPilot.Server.Response
{
    public class MeResponse
    {
        public string Id { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string? ProfileImage { get; set; }

        public List<string> Roles { get; set; } = [];
    }
}
