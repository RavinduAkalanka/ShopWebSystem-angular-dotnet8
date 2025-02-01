using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shop_backend.Data;
using shop_backend.DTOs;
using shop_backend.Models;

namespace shop_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomerController(AppDbContext context)
        {
            _context = context;
        }

        //Get all customer
        [HttpGet("getall")]
        public async Task<ActionResult> GetAllCustomers()
        {   
            var customers = await _context.Customers.Select(c => new CustomerDto
            {
                CustomerId = c.CustomerId,
                CustomerName = c.CustomerName,
                Email = c.Email,
                PhoneNo = c.PhoneNo,
                RegistrationDate = c.RegistrationDate
            }).ToListAsync();
            
            return Ok(customers);
        }

        //Get customer by id
        [HttpGet("getbyid/{id}")]
        public async Task<ActionResult> GetCustomerById(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            var customerWithId = new CustomerDto
            {
                CustomerId = customer.CustomerId,
                CustomerName = customer.CustomerName,
                Email = customer.Email,
                PhoneNo = customer.PhoneNo,
                RegistrationDate = customer.RegistrationDate
            };
            return Ok(customerWithId);
        }

        //Add new customer
        [HttpPost("add")]
        public async Task<ActionResult> AddCustomer([FromBody] CustomerCreateDto customer)
        {
            var existingCustomerEmail = await _context.Customers.FirstOrDefaultAsync(c => c.Email == customer.Email);
            if (existingCustomerEmail != null)
            {
                return Conflict("This email already exists.");
            }

            var newCustomer = new Customer
            {
                CustomerName = customer.CustomerName,
                Email = customer.Email,
                PhoneNo = customer.PhoneNo,
                RegistrationDate = DateTime.UtcNow
            };

            _context.Customers.Add(newCustomer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomerById), new { id = newCustomer.CustomerId }, customer);
        }

        //Edit customer
        [HttpPut("update/{id}")]
        public async Task<ActionResult> EditCustomer(int id, [FromBody] CustomerUpdateDto customerDto)
        {

            if (id != customerDto.CustomerId)
            {
                return BadRequest("The CustomerId in the URL does not match the CustomerId in the request body.");
            }

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound("The customer with the specified ID was not found.");
            }

            var existingCustomerEmail = await _context.Customers.AnyAsync(c => c.Email == customerDto.Email && c.CustomerId !=id);
            if (existingCustomerEmail)
            {
                return Conflict("A customer with the same email already exists.");
            }

            customer.CustomerName = customerDto.CustomerName;
            customer.Email = customerDto.Email;
            customer.PhoneNo = customerDto.PhoneNo;

            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            return Ok(customer);

        }

        //Delete customer
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if(customer == null){
                return NotFound("The customer with the specified ID was not found.");
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}