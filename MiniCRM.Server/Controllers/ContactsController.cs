using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniCRM.Server.Data;
using MiniCRM.Server.DTOs;
using MiniCRM.Server.Entities;

namespace MiniCRM.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var contacts = await _context.Contacts
                .OrderByDescending(x => x.CreatedAt)
                .Select(c => new
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    Position = c.Position,
                    CustomerId = c.CustomerId,
                    CustomerName = c.Customer != null ? c.Customer.Name : ""
                })
                .ToListAsync();

            return Ok(contacts);
        }

        [HttpPost]
        public async Task<IActionResult> Create(ContactDto dto)
        {

            if(!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            var contact = new Contact
            {
                CustomerId = dto.CustomerId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Position = dto.Position
            };

            _context.Contacts.Add(contact);

            await _context.SaveChangesAsync();

            return Ok(contact);
        }

        [HttpPut("{id}")]      
        public async Task<IActionResult> Update(int id, UpdateContactDto dto)
        {
            var contact = await _context.Contacts.FindAsync(id);

            if (contact is null)
                return NotFound();

            contact.CustomerId = dto.CustomerId;
            contact.FirstName = dto.FirstName;
            contact.LastName = dto.LastName;
            contact.Email = dto.Email;
            contact.Position = dto.Position;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);

            if (contact is null)
                return NotFound();

            _context.Contacts.Remove(contact);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
