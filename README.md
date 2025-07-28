# AdventureWorks Frontend

Angular application with JSON Server for mock API data.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Running the JSON Server

#### Option 1: Using npm scripts (Recommended)
```bash
# Start the server on localhost:3000
npm start

# Start the server with host 0.0.0.0 (accessible from other devices)
npm run dev

# Use configuration file
npm run config

# Test all endpoints
npm test
```

#### Option 2: Using custom server
```bash
npm run server
```

#### Option 3: Direct json-server command
```bash
npx json-server --watch mock-data/db.json --port 3000 --routes mock-data/routes.json --middlewares mock-data/middleware.js
```

## 📊 Available API Endpoints

The JSON server provides the following endpoints with **99 total records** across all collections:

### Persons (12 records)
- `GET /api/persons` - Get all persons
- `GET /api/persons/:id` - Get person by ID
- `POST /api/persons` - Create new person
- `PUT /api/persons/:id` - Update person
- `DELETE /api/persons/:id` - Delete person

### Vendors (15 records)
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get vendor by ID
- `POST /api/vendors` - Create new vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

### Purchase Orders (15 records)
- `GET /api/purchase-orders` - Get all purchase orders (with vendor info)
- `GET /api/purchase-orders/:id` - Get purchase order by ID (with vendor and details)
- `GET /api/purchase-orders/:id/details` - Get purchase order details only
- `POST /api/purchase-orders` - Create new purchase order
- `PUT /api/purchase-orders/:id` - Update purchase order
- `DELETE /api/purchase-orders/:id` - Delete purchase order

### Ship Methods (2 records)
- `GET /api/ship-methods` - Get all ship methods

### Purchase Order Details (45 records)
- `GET /api/purchase-order-details` - Get all purchase order details

### Territories (10 records)
- `GET /api/v1/territories` - Get all territories
- `GET /api/v1/territories/:id` - Get territory by ID
- `POST /api/v1/territories` - Create new territory
- `PUT /api/v1/territories/:id` - Update territory
- `DELETE /api/v1/territories/:id` - Delete territory

### Sales Orders (50 records)
- `GET /api/v1/sales-orders` - Get all sales orders (with customer, sales person, and territory info)
- `GET /api/v1/sales-orders/:id` - Get sales order by ID (with customer, sales person, territory, and details)
- `GET /api/v1/sales-orders/:id/details` - Get sales order details only
- `POST /api/v1/sales-orders` - Create new sales order
- `PUT /api/v1/sales-orders/:id` - Update sales order
- `DELETE /api/v1/sales-orders/:id` - Delete sales order

### Sales Order Details (200 records)
- `GET /api/sales-order-details` - Get all sales order details

## 🔧 Features

### Custom Middleware
The server includes custom middleware that provides:

1. **CORS Support** - Cross-origin requests enabled
2. **Request Logging** - All requests are logged with timestamps
3. **Enhanced Purchase Order Endpoints** - Purchase orders include vendor information and details
4. **Enhanced Sales Order Endpoints** - Sales orders include customer, sales person, and territory information with details
5. **Cache Control** - Proper cache headers for dynamic data
6. **Territory Management** - Territory data with geographic information

### Data Structure
The mock data includes:
- **Persons**: Employee, customer, vendor contact information
- **Vendors**: Supplier information with credit ratings and status
- **Purchase Orders**: Order management with vendor relationships
- **Purchase Order Details**: Line items for each order
- **Sales Order Headers**: Sales order management with customer relationships
- **Sales Order Details**: Line items for each sales order
- **Ship Methods**: Shipping options
- **Territories**: Geographic regions with country and group information

### Enhanced Sales Order Response Structure
Sales order endpoints now include rich relational data:

```json
{
  "salesOrderId": 1,
  "salesOrderNumber": "SO000001",
  "customer": {
    "businessEntityId": 10,
    "firstName": "John",
    "lastName": "Doe",
    "title": "Mr.",
    "fullName": "Mr. John Doe"
  },
  "salesPerson": {
    "businessEntityId": 4,
    "firstName": "Sarah",
    "lastName": "Williams",
    "title": "Mrs.",
    "fullName": "Mrs. Sarah Williams"
  },
  "territory": {
    "territoryId": 9,
    "name": "Australia",
    "countryRegionCode": "AU",
    "group": "Pacific"
  },
  "salesOrderDetails": [...]
}
```

### Query Support
All endpoints support JSON Server's query features:
- `GET /api/persons?personType=EM` - Filter by person type
- `GET /api/vendors?preferredVendorStatus=true` - Filter preferred vendors
- `GET /api/purchase-orders?_page=1&_limit=10` - Pagination
- `GET /api/v1/sales-orders?status=4` - Filter by order status
- `GET /api/v1/sales-orders?customerId=1` - Filter by customer
- `GET /api/v1/territories?group=North America` - Filter territories by group
- `GET /api/persons?_sort=lastName&_order=asc` - Sorting

## 🅰️ Angular Integration

### Service Examples
Use the provided service examples as starting points for your Angular services:

#### Purchase Orders Service
```typescript
import { AdventureWorksService } from './services/adventureworks.service';

// In your component
constructor(private adventureWorksService: AdventureWorksService) {}

// Get all persons
this.adventureWorksService.getPersons().subscribe(persons => {
  console.log('Persons:', persons);
});

// Get purchase order with vendor and details
this.adventureWorksService.getPurchaseOrder(1).subscribe(order => {
  console.log('Order with vendor:', order.vendor);
  console.log('Order details:', order.purchaseOrderDetails);
});
```

#### Sales Orders Service
```typescript
import { SalesOrderService } from './services/sales-order.service';

// In your component
constructor(private salesOrderService: SalesOrderService) {}

// Get all sales orders with customer info
this.salesOrderService.getSalesOrders().subscribe(orders => {
  console.log('Sales orders:', orders);
});

// Get sales order with customer and details
this.salesOrderService.getSalesOrder(1).subscribe(order => {
  console.log('Order with customer:', order.customer);
  console.log('Order details:', order.salesOrderDetails);
});

// Get sales statistics
this.salesOrderService.getSalesStatistics().subscribe(stats => {
  console.log('Total revenue:', stats.totalRevenue);
  console.log('Average order value:', stats.averageOrderValue);
});
```

### HTTP Module Setup
Make sure to import `HttpClientModule` in your Angular app:

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    // ... other imports
  ],
  // ... rest of module config
})
export class AppModule { }
```

## 🛠️ Development

### Adding New Data
1. Edit `mock-data/db.json` to add new collections or records
2. Update `mock-data/routes.json` if you need custom routing
3. Add custom middleware in `mock-data/middleware.js` if needed

### Custom Middleware
The middleware file (`mock-data/middleware.js`) handles:
- CORS headers
- Request logging
- Custom purchase order responses with vendor data
- Nested route handling for purchase order details

### Environment Variables
- `PORT` - Server port (default: 3000)

### Available npm Scripts
- `npm start` - Start server on localhost:3000
- `npm run dev` - Start server accessible from other devices
- `npm run server` - Use custom server implementation
- `npm run config` - Use configuration file
- `npm test` - Test all endpoints

## 📝 Example Usage

### Get all persons
```bash
curl http://localhost:3000/api/persons
```

### Get purchase order with vendor and details
```bash
curl http://localhost:3000/api/purchase-orders/1
```

### Get sales order with customer, sales person, and territory
```bash
curl http://localhost:3000/api/v1/sales-orders/1
```

### Get all territories
```bash
curl http://localhost:3000/api/v1/territories
```

### Filter vendors by status
```bash
curl http://localhost:3000/api/vendors?preferredVendorStatus=true
```

### Filter territories by group
```bash
curl http://localhost:3000/api/v1/territories?group=North America
```

### Test all endpoints
```bash
npm test
```

## 🔍 Troubleshooting

### Port already in use
If port 3000 is busy, you can:
1. Kill the process using the port
2. Use a different port: `PORT=3001 npm start`
3. Use the custom server: `npm run server`

### CORS issues
The server includes CORS headers, but if you're still having issues:
1. Check that the middleware is loading correctly
2. Verify the request origin
3. Check browser console for specific error messages

### Server not starting
1. Ensure all dependencies are installed: `npm install`
2. Check if port 3000 is available
3. Verify the mock-data files exist and are valid JSON
4. Run `npm test` to verify endpoints are working

## 📚 Resources

- [JSON Server Documentation](https://github.com/typicode/json-server)
- [AdventureWorks Database Schema](https://docs.microsoft.com/en-us/sql/samples/adventureworks-install-configure)
- [Angular HttpClient Guide](https://angular.io/guide/http)
