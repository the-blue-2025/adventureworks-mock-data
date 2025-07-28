const fs = require('fs');
const path = require('path');

// Sales Order Status constants
const SALES_ORDER_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  IN_PROGRESS: 3,
  SHIPPED: 4,
  DELIVERED: 5,
  CANCELLED: 6
};

// Ship Method constants
const SHIP_METHOD = {
  GROUND: 1,
  AIR: 2,
  EXPRESS: 3,
  OVERNIGHT: 4
};

// Territory IDs (from AdventureWorks)
const TERRITORIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Customer IDs (we'll use some person IDs as customers)
const CUSTOMER_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// Product IDs (from existing data)
const PRODUCT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

function generateSalesOrderHeaders(startId, count) {
  const salesOrders = [];
  
  for (let i = 0; i < count; i++) {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 365)); // Random date within last year
    
    const dueDate = new Date(orderDate);
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 7); // 7-37 days from order
    
    const shipDate = new Date(orderDate);
    shipDate.setDate(shipDate.getDate() + Math.floor(Math.random() * 14) + 1); // 1-15 days from order
    
    const subTotal = Math.floor(Math.random() * 10000) + 100; // $100-$10,100
    const taxAmt = subTotal * 0.08; // 8% tax
    const freight = Math.floor(Math.random() * 50) + 10; // $10-$60 freight
    const totalDue = subTotal + taxAmt + freight;
    
    salesOrders.push({
      salesOrderId: startId + i,
      id: startId + i,
      revisionNumber: Math.floor(Math.random() * 10) + 1,
      orderDate: orderDate.toISOString(),
      dueDate: dueDate.toISOString(),
      shipDate: shipDate.toISOString(),
      status: Math.floor(Math.random() * 6) + 1, // 1-6
      onlineOrderFlag: Math.random() > 0.5,
      salesOrderNumber: `SO${String(startId + i).padStart(6, '0')}`,
      purchaseOrderNumber: `PO${String(Math.floor(Math.random() * 10000)).padStart(6, '0')}`,
      accountNumber: `AW${String(Math.floor(Math.random() * 100000)).padStart(8, '0')}`,
      customerId: CUSTOMER_IDS[Math.floor(Math.random() * CUSTOMER_IDS.length)],
      salesPersonId: Math.floor(Math.random() * 10) + 1,
      territoryId: TERRITORIES[Math.floor(Math.random() * TERRITORIES.length)],
      billToAddressId: Math.floor(Math.random() * 100) + 1,
      shipToAddressId: Math.floor(Math.random() * 100) + 1,
      shipMethodId: Math.floor(Math.random() * 4) + 1,
      creditCardId: Math.floor(Math.random() * 50) + 1,
      creditCardApprovalCode: `APP${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
      currencyRateId: 1,
      subTotal: subTotal,
      taxAmt: taxAmt,
      freight: freight,
      totalDue: totalDue,
      comment: Math.random() > 0.7 ? `Order comment ${startId + i}` : null,
      rowguid: generateGuid(),
      modifiedDate: new Date().toISOString()
    });
  }
  
  return salesOrders;
}

function generateSalesOrderDetails(startId, count) {
  const salesOrderDetails = [];
  
  for (let i = 0; i < count; i++) {
    const orderQty = Math.floor(Math.random() * 50) + 1; // 1-50 quantity
    const unitPrice = Math.floor(Math.random() * 1000) + 10; // $10-$1010
    const unitPriceDiscount = Math.random() > 0.8 ? Math.floor(Math.random() * 100) / 100 : 0; // 0-1 discount
    const lineTotal = orderQty * unitPrice * (1 - unitPriceDiscount);
    
    salesOrderDetails.push({
      salesOrderDetailId: startId + i,
      id: startId + i,
      salesOrderId: Math.floor(Math.random() * 100) + 1, // Reference to sales order header
      carrierTrackingNumber: Math.random() > 0.5 ? `TRK${String(Math.floor(Math.random() * 1000000)).padStart(8, '0')}` : null,
      orderQty: orderQty,
      productId: PRODUCT_IDS[Math.floor(Math.random() * PRODUCT_IDS.length)],
      specialOfferId: Math.floor(Math.random() * 10) + 1,
      unitPrice: unitPrice,
      unitPriceDiscount: unitPriceDiscount,
      lineTotal: lineTotal,
      rowguid: generateGuid(),
      modifiedDate: new Date().toISOString()
    });
  }
  
  return salesOrderDetails;
}

function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Load existing database
const dbPath = path.join(__dirname, 'mock-data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Generate new sales data
const newSalesOrderHeaders = generateSalesOrderHeaders(1, 50); // Generate 50 sales order headers
const newSalesOrderDetails = generateSalesOrderDetails(1, 200); // Generate 200 sales order details

// Add to database
if (!db['sales-order-headers']) {
  db['sales-order-headers'] = [];
}
if (!db['sales-order-details']) {
  db['sales-order-details'] = [];
}

db['sales-order-headers'] = db['sales-order-headers'].concat(newSalesOrderHeaders);
db['sales-order-details'] = db['sales-order-details'].concat(newSalesOrderDetails);

// Write back to file
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`Generated ${newSalesOrderHeaders.length} sales order headers`);
console.log(`Generated ${newSalesOrderDetails.length} sales order details`);
console.log('Sales data has been added to db.json'); 