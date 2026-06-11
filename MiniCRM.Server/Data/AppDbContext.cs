using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MiniCRM.Server.Entities;
using MiniCRM.Server.Enums;

namespace MiniCRM.Server.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Customer configuration
            modelBuilder.Entity<Customer>().HasKey(x => x.Id);

            modelBuilder.Entity<Customer>().Property(x => x.Name)
                .HasMaxLength(200)
                .IsRequired();

            modelBuilder.Entity<Customer>().Property(x => x.Email)
                .HasMaxLength(255);

            modelBuilder.Entity<Customer>().Property(x => x.Phone)
                .HasMaxLength(50);


            // Contact configuration
            modelBuilder.Entity<Contact>().HasKey(x => x.Id);
            modelBuilder.Entity<Contact>().HasOne(x => x.Customer)
            .WithMany(x => x.Contacts)
            .HasForeignKey(x => x.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);


            // Opportunity configuration
            modelBuilder.Entity<Opportunity>().HasKey(x => x.Id);

            modelBuilder.Entity<Opportunity>().Property(x => x.Value)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Opportunity>().Property(x => x.Stage)
                .HasConversion(new EnumToStringConverter<OpportunityStage>());

            modelBuilder.Entity<Opportunity>().HasOne(x => x.Customer)
                .WithMany(x => x.Opportunities)
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Note configuration
            modelBuilder.Entity<Note>().HasKey(x => x.Id);

            modelBuilder.Entity<Note>().HasOne(x => x.Customer)
                .WithMany(x => x.Notes)
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Stage conversion configured above
        }

        public DbSet<Customer> Customers => Set<Customer>();

        public DbSet<Contact> Contacts => Set<Contact>();

        public DbSet<Opportunity> Opportunities => Set<Opportunity>();

        public DbSet<Note> Notes => Set<Note>();
    }
}
