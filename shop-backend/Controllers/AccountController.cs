using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using shop_backend.DTOs;
using shop_backend.Models;

namespace shop_backend.Controllers
{   [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _configuration;
        public AccountController(UserManager<AppUser> userManager, IConfiguration configuration) 
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register ([FromBody] RegisterDto registerDto)
        {
            // Check if the email is already registered
            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                return Conflict("Email is already registered.");
            }

            var user = new AppUser
            {
                UserName =registerDto.Email,
                Email = registerDto.Email,
                FullName = registerDto.FullName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded){
                return BadRequest("Registraion unsuccessfull");
            }
            return Ok(new { Message = "User registered successfully!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login ([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if(user != null && await _userManager.CheckPasswordAsync(user,loginDto.Password))
            {
                var signInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AppSettings:JWTSecret"]!));

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("User ID",user.Id.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddHours(6),
                    Issuer = _configuration["AppSettings:JWTIssuer"],
                    Audience = _configuration["AppSettings:JWTAudience"],
                    SigningCredentials = new SigningCredentials(
                        signInKey,
                        SecurityAlgorithms.HmacSha256Signature
                    )
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                return Ok(new {token});
            }else{
                return BadRequest("Email or Password Incorrect.");
            }
        }
    }
}