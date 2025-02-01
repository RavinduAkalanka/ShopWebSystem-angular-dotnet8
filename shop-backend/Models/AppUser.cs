using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace shop_backend.Models
{
    public class AppUser : IdentityUser
    {
        public string FullName {get; set;} = string.Empty;
    }
}