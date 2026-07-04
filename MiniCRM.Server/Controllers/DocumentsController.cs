using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniCRM.Server.Data;
using MiniCRM.Server.DTOs;
using MiniCRM.Server.Entities;
using MiniCRM.Services;
using MiniCRM.Services;
using MiniCRM.Services.Ingestion;

namespace MiniCRM.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly SemanticSearch _semanticSearch;
        private readonly ChatService _chatService;
        private readonly ILogger<DocumentsController> _logger;

        public DocumentsController(AppDbContext context, IWebHostEnvironment environment, SemanticSearch semanticSearch, ChatService chatService, ILogger<DocumentsController> logger)
        {
            _context = context;
            _environment = environment;
            _semanticSearch = semanticSearch;
            _chatService = chatService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var documents = await _context.Documents
                .OrderByDescending(d => d.UploadedAt)
                .Select(d => new
                {
                    Id = d.Id,
                    FileName = d.FileName,
                    FileType = d.FileType,
                    Extension = d.Extension,
                    FileSize = d.FileSize,
                    UploadedAt = d.UploadedAt
                })
                .ToListAsync();
            return Ok(documents);

        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(DocumentDto documentDto)
        {
            if (documentDto.File == null || documentDto.File.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var dataDir = Path.Combine(_environment.WebRootPath, "Data");
            Directory.CreateDirectory(dataDir);

            var storedFileName = documentDto.File.FileName;
            var filePath = Path.Combine(dataDir, storedFileName);

            await using (var stream = System.IO.File.Create(filePath))
            {
                await documentDto.File.CopyToAsync(stream);
            }

            _logger.LogInformation("Starting ingestion");
            var logPath = Path.Combine(_environment.WebRootPath, "logs");
            Directory.CreateDirectory(logPath);

            await _semanticSearch.IngestDocumentAsync(
                new DirectoryInfo(dataDir),
                storedFileName);

            await System.IO.File.AppendAllTextAsync(
                Path.Combine(logPath, "ingest.log"),
                $"{DateTime.UtcNow}: Finished ingestion{Environment.NewLine}"
            );


            _logger.LogInformation("Finished ingestion");

            var document = new Document
            {
                FileName = documentDto.File.FileName,
                FilePath = $"Data/{storedFileName}",
                FileType = documentDto.File.ContentType,
                Extension = Path.GetExtension(documentDto.File.FileName)
                    .TrimStart('.')
                    .ToLowerInvariant(),
                FileSize = documentDto.File.Length,
            };

            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            return Ok(document);
        }

        [HttpGet("{id}/download")]
        public async Task<IActionResult> Download(int id)
        {
            var document = await _context.Documents.FindAsync(id);

            if (document is null)
                return NotFound();

            var filePath = Path.Combine(
                _environment.WebRootPath,
                document.FilePath);

            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var bytes = await System.IO.File.ReadAllBytesAsync(filePath);

            return File(
                bytes,
                document.FileType,
                document.FileName);
        }

        [HttpPost("chat/stream")]
        public async Task Stream(
        [FromBody] ChatRequestDto request,
        CancellationToken cancellationToken)
        {
            Response.ContentType = "text/plain";

            try
            {
                await foreach (var chunk in _chatService.StreamResponseAsync(
                    request.Message,
                    cancellationToken))
                {
                    await Response.WriteAsync(chunk, cancellationToken);
                    await Response.Body.FlushAsync(cancellationToken);
                }
            }
            catch (Exception ex)
            {

                // If nothing has been sent yet
                if (!Response.HasStarted)
                {
                    Response.StatusCode = 500;
                    await Response.WriteAsync(
                        "Sorry, something went wrong.",
                        cancellationToken);
                }
                else
                {
                    // Stream already started
                    await Response.WriteAsync(
                        "\n\n Sorry, something went wrong.",
                        cancellationToken);

                    await Response.Body.FlushAsync(cancellationToken);
                }
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null)
            {
                return NotFound();
            }
            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
