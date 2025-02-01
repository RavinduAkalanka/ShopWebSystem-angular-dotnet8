using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;

namespace shop_backend.Models
{
    public class Customer
    {
        public int CustomerId {get; set;} //Primary Key
        public string CustomerName {get; set;} = string.Empty;
        public string Email {get; set;} = string.Empty;
        public string PhoneNo {get; set;} = string.Empty;
        public DateTime RegistrationDate {get; set;}
    }
}