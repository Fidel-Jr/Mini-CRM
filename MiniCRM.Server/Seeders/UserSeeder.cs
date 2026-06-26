using Microsoft.AspNetCore.Identity;

namespace MiniCRM.Server.Seeders
{
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.DependencyInjection;
    using MiniCRM.Server.Entities;

    public static class UserSeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

            var adminEmail = "admin@example.com";
            var admin = await userManager.FindByEmailAsync(adminEmail);
            if (admin == null)
            {
                admin = new ApplicationUser
                {
                    FirstName = "Company",
                    LastName = "Admin",
                    UserName = adminEmail,
                    Email = adminEmail,
                };

                var result = await userManager.CreateAsync(admin, "Admin@12345");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }

            var salesEmail = "salesrep@example.com";
            var sales = await userManager.FindByEmailAsync(salesEmail);
            if (sales == null)
            {
                sales = new ApplicationUser
                {
                    FirstName = "Sales",
                    LastName = "Representative",
                    UserName = salesEmail,
                    Email = salesEmail,
                };

                var result = await userManager.CreateAsync(sales, "Salesrep@12345");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(sales, "Sales Representative");
                }
            }
        }
    }
}
