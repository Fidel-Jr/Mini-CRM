using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiniCRM.Server.Data;
using MiniCRM.Server.DTOs;
using MiniCRM.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace MiniCRM.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OpportunitiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OpportunitiesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Opportunities.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(OpportunityDto dto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var opportunity = new Opportunity
            {
                CustomerId = dto.CustomerId,
                Title = dto.Title,
                Value = dto.Value,
                Stage = dto.Stage
            };

            _context.Opportunities.Add(opportunity);

            await _context.SaveChangesAsync();

            return Ok(opportunity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateOpportunityDto dto)
        {
            var opportunity = await _context.Opportunities.FindAsync(id);

            if (opportunity is null)
                return NotFound();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            opportunity.Title = dto.Title;
            opportunity.Value = dto.Value;
            opportunity.Stage = dto.Stage;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var opportunity = await _context.Opportunities.FindAsync(id);

            if (opportunity is null)
                return NotFound();

            _context.Opportunities.Remove(opportunity);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
