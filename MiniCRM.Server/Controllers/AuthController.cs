using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniCRM.Server.Data;
using MiniCRM.Server.DTOs;
using MiniCRM.Server.Entities;
using MiniCRM.Server.Response;
using MiniCRM.Server.Services;
using System.Net;
using System.Security.Claims;

namespace MiniCRM.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtService _jwtService;
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<ApplicationUser> userManager, IJwtService jwtService, AppDbContext context, IConfiguration configuration)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _context = context;
            _configuration = configuration;
        }
        

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user is null)
            {
                return Unauthorized(new
                {
                    Message = "Invalid email or password."
                });
            }

            var isPasswordValid = await _userManager
                .CheckPasswordAsync(user, request.Password);

            if (!isPasswordValid)
            {
                return Unauthorized(new
                {
                    Message = "Invalid email or password."
                });
            }

            var accessExpires =
                DateTime.UtcNow.AddMinutes(
                    int.Parse(_configuration["Jwt:ExpiresInMinutes"]!));

            var token = await _jwtService.GenerateAccessTokenAsync(user);
            var refreshToken = await _jwtService.GenerateRefreshTokenAsync(user.Id);

            return Ok(new LoginResponse
            {
                AccessToken = token,
                RefreshToken = refreshToken,
                AccessTokenExpiresAt = accessExpires,
                RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(7)
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user is null)
            {
                return Unauthorized();
            }

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new MeResponse
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfileImage = user.ProfileImage,
                Roles = roles.ToList()
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(DTOs.RefreshRequest request)
        {
            var storedToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken && !rt.IsRevoked && rt.Expires > DateTime.UtcNow);

            if (storedToken == null)
                return BadRequest(new
                {
                    Message = "Invalid refresh token."
                });

            var user = storedToken.User;

            var roles = await _userManager.GetRolesAsync(user);

            storedToken.IsRevoked = true;
            await _context.SaveChangesAsync();

            var newAccessToken = await _jwtService.GenerateAccessTokenAsync(user);
            var newRefreshToken = await _jwtService.GenerateRefreshTokenAsync(user.Id);

            var accessExpires =
                DateTime.UtcNow.AddMinutes(
                    int.Parse(_configuration["Jwt:ExpiresInMinutes"]!));

            return Ok(new
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                AccessTokenExpiresAt = accessExpires,
                RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(7)
            });
        }
    }
}
