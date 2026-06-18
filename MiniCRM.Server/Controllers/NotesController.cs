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
    public class NotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var notes = await _context.Notes
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new
                {
                    Id = n.Id,
                    Content = n.Content,
                    CustomerId = n.CustomerId,
                    CustomerName = n.Customer != null ? n.Customer.Name : ""
                })
                .ToListAsync();
            return Ok(notes);
        }

        [HttpPost]
        public async Task<IActionResult> Create(NoteDto dto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var note = new Note
            {
                CustomerId = dto.CustomerId,
                Content = dto.Content
            };

            _context.Notes.Add(note);

            await _context.SaveChangesAsync();

            return Ok(note);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateNoteDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var note = await _context.Notes.FindAsync(id);

            if (note is null)
                return NotFound();

            note.Content = dto.Content;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var note = await _context.Notes.FindAsync(id);

            if (note is null)
                return NotFound();

            _context.Notes.Remove(note);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
