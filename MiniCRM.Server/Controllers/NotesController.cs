using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateNoteDto dto)
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

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
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
