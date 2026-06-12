using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniCRM.Server.Data;
using MiniCRM.Server.DTOs;
using MiniCRM.Server.Entities;

namespace MiniCRM.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _context.Customers
                .AsNoTracking()
                .OrderBy(x => x.Name)
                 .Select(x => new CustomerDetailsDto
                 {
                     Id = x.Id,
                     Name = x.Name,
                     Industry = x.Industry,
                     Website = x.Website,
                     Email = x.Email,
                     Phone = x.Phone,

                     Contacts = x.Contacts.Select(c => new ContactDetailsDto
                     {
                         FirstName = c.FirstName,
                         LastName = c.LastName,
                         Email = c.Email,
                         Position = c.Position
                     }).ToList(),

                     Opportunities = x.Opportunities.Select(o => new OpportunityDetailsDto
                     {
                         CustomerId = o.CustomerId,
                         Title = o.Title,
                         Value = o.Value,
                         Stage = o.Stage.ToString()
                     }).ToList(),

                     Notes = x.Notes.Select(n => new NoteDetailsDto
                     {
                         CustomerId = n.CustomerId,
                         Content = n.Content
                     }).ToList()
                 })
                .ToListAsync();

            return Ok(customers);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var customer = await _context.Customers
            .Where(x => x.Id == id)
            .Select(x => new CustomerDetailsDto
            {
                Id = x.Id,
                Name = x.Name,
                Industry = x.Industry,
                Website = x.Website,
                Email = x.Email,
                Phone = x.Phone,

                Contacts = x.Contacts.Select(c => new ContactDetailsDto
                {
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    Position = c.Position
                }).ToList(),

                Opportunities = x.Opportunities.Select(o => new OpportunityDetailsDto
                {
                    CustomerId = o.CustomerId,
                    Title = o.Title,
                    Value = o.Value,
                    Stage = o.Stage.ToString()
                }).ToList(),

                Notes = x.Notes.Select(n => new NoteDetailsDto
                {
                    CustomerId = n.CustomerId,
                    Content = n.Content
                }).ToList()
            })
            .FirstOrDefaultAsync();

            if (customer == null)
                return NotFound();

            return Ok(customer);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CustomerDto dto)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var customer = new Customer
            {
                Name = dto.Name,
                Industry = dto.Industry,
                Website = dto.Website,
                Email = dto.Email,
                Phone = dto.Phone
            };

            _context.Customers.Add(customer);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get),
                new { id = customer.Id },
                customer);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateCustomerDto dto)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer is null)
                return NotFound();

            customer.Name = dto.Name;
            customer.Industry = dto.Industry;
            customer.Website = dto.Website;
            customer.Email = dto.Email;
            customer.Phone = dto.Phone;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer is null)
                return NotFound();

            _context.Customers.Remove(customer);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
