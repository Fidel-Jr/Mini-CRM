using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MiniCRM.Server.Data;
using MiniCRM.Server.DTOs;
using MiniCRM.Server.Entities;
using MiniCRM.Server.Enums;
using MiniCRM.Server.Services;

namespace MiniCRM.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IJwtService _jwtService;
        private readonly FileUploadService _fileUploadService;

        public UsersController(AppDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IJwtService jwtService, FileUploadService fileUploadService)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtService = jwtService;
            _fileUploadService = fileUploadService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {

            if (!ModelState.IsValid)
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

            // Ensure role exists
            var roleExists = await _roleManager.RoleExistsAsync(request.Role);

            if (!roleExists)
            {
                return BadRequest(new
                {
                    Message = "Invalid role."
                });
            }

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                JoinedDate = request.JoinedDate,
                ProfileImage = "default.jpg"
            };

            var result = await _userManager.CreateAsync(
                user,
                request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.Select(e => e.Description));
            }

            await _userManager.AddToRoleAsync(user, request.Role);

            return Ok(new
            {
                Message = "User registered successfully."
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = _userManager.Users.ToList();
            var userDtos = new List<UserDetailsDto>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDtos.Add(new UserDetailsDto
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email!,
                    Role = roles.FirstOrDefault() ?? "No Role",
                    ProfileImage = user.ProfileImage!
                });
            }
            return Ok(new { userDtos });
        }

        [HttpGet("roles")]
        public IActionResult GetRoles()
        {
            var roles = _roleManager.Roles
                .Select(r => r.Name)
                .ToList();

            return Ok(roles);
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileDto request)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user is null)
            {
                return Unauthorized();
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;

            // Email
            if (user.Email != request.Email)
            {
                var existingUser = await _userManager.FindByEmailAsync(request.Email);

                if (existingUser != null &&
                    existingUser.Id != user.Id)
                {
                    return BadRequest(new
                    {
                        Message = "Email already exists."
                    });
                }

                user.Email = request.Email;
                user.UserName = request.Email;
            }

            // Profile Image
            if (request.ProfileImage is not null)
            {
                await _fileUploadService.DeleteImageAsync(user.ProfileImage);

                var imageName = await _fileUploadService
                    .SaveImageAsync(request.ProfileImage);

                user.ProfileImage = imageName;
            }

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(
                    result.Errors.Select(e => e.Description));
            }

            // Password
            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                var token = await _userManager
                    .GeneratePasswordResetTokenAsync(user);

                var passwordResult =
                    await _userManager.ResetPasswordAsync(
                        user,
                        token,
                        request.Password);

                if (!passwordResult.Succeeded)
                {
                    return BadRequest(
                        passwordResult.Errors
                            .Select(e => e.Description));
                }
            }

            return Ok(new
            {
                Message = "Profile updated successfully."
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(
        string id,
        [FromForm] UpdateUserDto request)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user is null)
            {
                return NotFound(new
                {
                    Message = "User not found."
                });
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.JoinedDate = request.JoinedDate;
            user.Status = request.Status;

            // Email
            if (user.Email != request.Email)
            {
                var existingUser = await _userManager
                    .FindByEmailAsync(request.Email);

                if (existingUser != null &&
                    existingUser.Id != user.Id)
                {
                    return BadRequest(new
                    {
                        Message = "Email already exists."
                    });
                }

                user.Email = request.Email;
                user.UserName = request.Email;
            }

            // Profile Image
            if (request.ProfileImage is not null)
            {
                await _fileUploadService.DeleteImageAsync(user.ProfileImage);

                var imageName = await _fileUploadService
                    .SaveImageAsync(request.ProfileImage);

                user.ProfileImage = imageName;
            }

            // Role
            var roleExists = await _roleManager
                .RoleExistsAsync(request.Role);

            if (!roleExists)
            {
                return BadRequest(new
                {
                    Message = "Invalid role."
                });
            }

            var currentRoles =
                await _userManager.GetRolesAsync(user);

            if (!currentRoles.Contains(request.Role))
            {
                await _userManager.RemoveFromRolesAsync(
                    user,
                    currentRoles);

                await _userManager.AddToRoleAsync(
                    user,
                    request.Role);
            }

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(
                    result.Errors.Select(e => e.Description));
            }

            // Password
            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                var token = await _userManager
                    .GeneratePasswordResetTokenAsync(user);

                var passwordResult =
                    await _userManager.ResetPasswordAsync(
                        user,
                        token,
                        request.Password);

                if (!passwordResult.Succeeded)
                {
                    return BadRequest(
                        passwordResult.Errors
                            .Select(e => e.Description));
                }
            }

            return Ok(new
            {
                Message = "User updated successfully."
            });
        }

        [HttpPatch("{id}/deactivate")]
        public async Task<IActionResult> DeactivateUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user is null)
            {
                return NotFound(new
                {
                    Message = "User not found."
                });
            }

            if (user.Status == UserStatus.Deactivated)
            {
                return BadRequest(new
                {
                    Message = "User is already deactivated."
                });
            }

            user.Status = UserStatus.Deactivated;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.Select(e => e.Description));
            }

            return Ok(new
            {
                Message = "User deactivated successfully."
            });
        }
    }
}
