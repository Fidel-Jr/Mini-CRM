using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiniCRM.Server.Data;
using MiniCRM.Server.DTOs;
using MiniCRM.Server.Entities;

namespace MiniCRM.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Create(ContactDto dto)
        {
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

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateContactDto dto)
        {
            var contact = await _context.Contacts.FindAsync(id);

            if (contact is null)
                return NotFound();

            contact.FirstName = dto.FirstName;
            contact.LastName = dto.LastName;
            contact.Email = dto.Email;
            contact.Position = dto.Position;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
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
