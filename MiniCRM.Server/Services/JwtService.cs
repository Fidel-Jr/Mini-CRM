using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MiniCRM.Server.Data;
using MiniCRM.Server.Entities;
using MiniCRM.Server.Response;
using System.IdentityModel.Tokens.Jwt;

using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace MiniCRM.Server.Services
{
    public interface IJwtService
    {
        Task<TokenResponse> GenerateAccessTokenAsync(ApplicationUser user);
        Task<TokenResponse> GenerateRefreshTokenAsync(string userId);
    }
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _context;
        public JwtService(
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            AppDbContext context)
        {
            _configuration = configuration;
            _userManager = userManager;
            _context = context; 
        }

        public async Task<TokenResponse> GenerateAccessTokenAsync(ApplicationUser user)
        {
            var roles =
                await _userManager.GetRolesAsync(user); 

            var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!)
        };

            claims.AddRange(
                roles.Select(role =>
                    new Claim(ClaimTypes.Role, role)));

            var key =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        _configuration["Jwt:Key"]!));

            var credentials =
                new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddMinutes(
                int.Parse(_configuration["Jwt:ExpiresInMinutes"]!));

            var token =
                new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: expires,
                    signingCredentials: credentials);

            return new TokenResponse
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expires = expires
            };
        }

        public async Task<TokenResponse> GenerateRefreshTokenAsync(string userId)
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                UserId = userId,
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(7),
                IsRevoked = false
            };

            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return new TokenResponse
            {
                Token = refreshToken.Token,
                Expires = refreshToken.Expires
            };
        }
    }
}
