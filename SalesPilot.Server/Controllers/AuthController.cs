using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using SalesPilot.Server.DTOs;
using SalesPilot.Server.Entities;
using SalesPilot.Server.Response;
using SalesPilot.Server.Services;
using System.Net;
using System.Security.Claims;

namespace SalesPilot.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtService _jwtService;

        public AuthController(UserManager<ApplicationUser> userManager, IJwtService jwtService)
        {
            _userManager = userManager;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {

            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = await _userManager.FindByEmailAsync(request.Email);

            if (existingUser is not null)
            {
                return BadRequest(new
                {
                    Message = "Email already exists."
                });
            }

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName
            };

            var result = await _userManager.CreateAsync(
                user,
                request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.Select(e => e.Description));
            }

            await _userManager.AddToRoleAsync(user, "Sales Representative");

            return Ok(new
            {
                Message = "User registered successfully."
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
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

            var token = await _jwtService.GenerateTokenAsync(user);

            return Ok(new LoginResponse
            {
                Token = token
            });
        }

        [HttpGet("me")]
        [Authorize]
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
    }
}
