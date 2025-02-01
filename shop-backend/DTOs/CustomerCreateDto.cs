using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shop_backend.DTOs
{
    public class CustomerCreateDto
    {
        public string CustomerName {get; set;} = string.Empty;
        public string Email {get; set;} = string.Empty;
        public string PhoneNo {get; set;} = string.Empty;
        
    }
}