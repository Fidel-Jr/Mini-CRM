using Microsoft.AspNetCore.Identity;

namespace MiniCRM.Server.Seeders
{
    public static class RoleSeeder
    {
        public static async Task SeedAsync(
            IServiceProvider services)
        {
            var roleManager =
                services.GetRequiredService<
                    RoleManager<IdentityRole>>();

            string[] roles =
            {
            "Admin",
            "Sales Representative"
        };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(
                        new IdentityRole(role));
                }
            }
        }
    }
}
