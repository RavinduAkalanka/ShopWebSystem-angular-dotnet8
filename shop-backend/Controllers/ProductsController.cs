using shop_backend.Data;
using shop_backend.Models;
using shop_backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace shop_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // Get all products
        [HttpGet("getall")]
        public async Task<ActionResult> GetProducts()
        {
            var products = await _context.Products.Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                ProductCode = p.ProductCode,
                ProductName = p.ProductName,
                ProductCategory = p.ProductCategory,
                UnitPrice = p.UnitPrice,
                Stock = p.Stock,
                ReorderPoint = p.ReorderPoint
            }).ToListAsync();
            return Ok(products);
        }

        // Get product by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();

            var productDto = new ProductDto
            {
                ProductId = product.ProductId,
                ProductCode = product.ProductCode,
                ProductName = product.ProductName,
                ProductCategory = product.ProductCategory,
                UnitPrice = product.UnitPrice,
                Stock = product.Stock,
                ReorderPoint = product.ReorderPoint
            };

            return Ok(productDto);
        }

        // Add a new product
        [HttpPost("add")]
        public async Task<IActionResult> AddProduct([FromBody] ProductCreateDto productDto)
        {
            // Check if a product with the same Productcode already exists
            var existingProductCode = await _context.Products
                .FirstOrDefaultAsync(p => p.ProductCode == productDto.ProductCode);

            if (existingProductCode != null)
            {

                return Conflict("Product code already exists.");
            }

            // Check if a product with the same ProductName already exists
            var existingProductByName = await _context.Products
                .FirstOrDefaultAsync(p => p.ProductName == productDto.ProductName);

            if (existingProductByName != null)
            {

                return Conflict("Product Name already exists.");
            }

            // Create the new Product entity
            var product = new Product
            {
                ProductCode = productDto.ProductCode,
                ProductName = productDto.ProductName,
                ProductCategory = productDto.ProductCategory,
                UnitPrice = productDto.UnitPrice,
                Stock = productDto.Stock,
                ReorderPoint = productDto.ReorderPoint
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Return CreatedAtAction with the created product data
            return CreatedAtAction(nameof(GetProductById), new { id = product.ProductId }, productDto);
        }

        //Edit Product
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductDto productDto)
        {
            if (id != productDto.ProductId)
                return BadRequest("The ProductId in the URL does not match the ProductId in the request body.");

            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound("The product with the specified ID was not found.");

            // Check for conflicts in ProductCode and ProductName
            var existingProductCode = await _context.Products
                .AnyAsync(p => p.ProductCode == productDto.ProductCode && p.ProductId != id);
            if (existingProductCode)
                return Conflict("A product with the same ProductCode already exists.");

            var existingProductName = await _context.Products
                .AnyAsync(p => p.ProductName == productDto.ProductName && p.ProductId != id);
            if (existingProductName)
                return Conflict("A product with the same ProductName already exists.");

            product.ProductCode = productDto.ProductCode;
            product.ProductName = productDto.ProductName;
            product.ProductCategory = productDto.ProductCategory;
            product.UnitPrice = productDto.UnitPrice;
            product.Stock = productDto.Stock;
            product.ReorderPoint = productDto.ReorderPoint;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        //Delete Product
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound("The product with the specified ID was not found.");

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}