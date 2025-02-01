# ShopWebSystem

**ShopWebSystem** is a web-based application built using Angular 18 and .NET 8. It provides a platform for managing products and customers, featuring user registration and authentication through JWT tokens. The project follows REST API principles and uses Tailwind CSS for UI design.

## Features
- CRUD operations for products and customers
- User registration and authentication using JWT
- RESTful APIs built with .NET 8
- UI design powered by Tailwind CSS

## Technologies Used
- **Frontend:** Angular 18, Tailwind CSS
- **Backend:** .NET 8 (REST API)
- **Authentication:** JWT (JSON Web Tokens)

## Prerequisites
Make sure you have the following installed:
- Node.js (v16 or higher)
- Angular CLI
- .NET SDK 8
- SQL Server

## Installation
### Clone the repository
```bash
git clone <your-repo-url>
cd shopWebSystem
```

### Backend Setup
1. Navigate to the `shop-backend` folder:
   ```bash
   cd shop-backend
   ```
2. Restore NuGet packages and build the project:
   ```bash
   dotnet restore
   dotnet build
   ```
3. Update the `appsettings.json` file with your database configuration.
4. Apply database migrations:
   ```bash
   dotnet ef database update
   ```
5. Run the backend server:
   ```bash
   dotnet run
   ```

### Frontend Setup
1. Navigate to the `shop-frontend` folder:
   ```bash
   cd ../shop-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend application:
   ```bash
   ng serve
   ```

## Usage
- Access the frontend at `http://localhost:4200`
- The backend API is available at `http://localhost:5196`

## API Endpoints

### Account
- `POST /api/Account/register`: Register a new user
- `POST /api/Account/login`: Login a user and receive a JWT token

### Products
- `GET /api/products/getall`: Get all products
- `GET /api/products/{id}`: Get a product by ID
- `POST /api/products/add`: Add a new product
- `PUT /api/products/update/{id}`: Update a product
- `DELETE /api/products/delete/{id}`: Delete a product

### Customers
- `GET /api/customer/getall`: Get all customers
- `GET /api/customer/getbyid{id}`:  Get customer by ID
- `POST /api/customer/add`: Add a new customer
- `PUT /api/customer/update/{id}`: Update a customer
- `DELETE /api/customer/delete/{id}`: Delete a customer


