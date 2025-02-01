using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shop_backend.DTOs
{
    public class ProductDto
    {
        public int ProductId { get; set; }

        public string ProductCode { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string ProductCategory { get; set ;} = string.Empty;
        public float UnitPrice {get; set;}
        public int Stock { get; set; }
        public int ReorderPoint { get; set; }
    }
}