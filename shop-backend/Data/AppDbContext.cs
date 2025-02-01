using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using shop_backend.Models;

namespace shop_backend.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product>? Products { get; set; }
        public DbSet<Customer>? Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Call the base OnModelCreating to include Identity configurations
            base.OnModelCreating(modelBuilder);

            // Additional configurations for Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(p => p.ProductId); // Define Primary Key
            });

            // Additional configurations for Customer
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(c => c.CustomerId); // Define Primary Key
            });
        }
    }
}
