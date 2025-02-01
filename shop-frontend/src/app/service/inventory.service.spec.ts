import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InventoryService } from './inventory.service';
import { environment } from '../../environments/environment'; 

describe('InventoryService', () => {
  let service: InventoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InventoryService]
    });
    service = TestBed.inject(InventoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); 
  });

  it('should fetch all products', () => {
    const mockProducts = [
      {
        productId: 1,
        productCode: 'P001',
        productName: 'Product 1',
        productCategory: 'Category 1',
        unitPrice: 100,
        stock: 50,
        reorderPoint: 10
      },
      {
        productId: 2,
        productCode: 'P002',
        productName: 'Product 2',
        productCategory: 'Category 2',
        unitPrice: 150,
        stock: 30,
        reorderPoint: 5
      }
    ];

    service.getAllProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts); // Ensure the response is as expected
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: `${environment.API_URL}${environment.endpoints.products}getall`
    });

    expect(req.request.method).toBe('GET');

    req.flush(mockProducts); 
  });
});
