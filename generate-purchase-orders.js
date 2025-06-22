const fs = require('fs');

// Function to generate random date within a range
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to format date as ISO string
function formatDate(date) {
    return date.toISOString().split('T')[0] + 'T00:00:00Z';
}

// Function to generate purchase orders
function generatePurchaseOrders(startId, count) {
    const purchaseOrders = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');
    
    for (let i = 0; i < count; i++) {
        const orderDate = randomDate(startDate, endDate);
        const shipDate = new Date(orderDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // 0-30 days later
        
        const subTotal = Math.round((Math.random() * 1000 + 50) * 100) / 100; // $50-$1050
        const taxAmt = Math.round(subTotal * 0.1 * 100) / 100; // 10% tax
        const freight = Math.round((Math.random() * 20 + 5) * 100) / 100; // $5-$25 freight
        const totalDue = Math.round((subTotal + taxAmt + freight) * 100) / 100;
        
        purchaseOrders.push({
            purchaseOrderId: startId + i,
            id: startId + i,
            status: Math.floor(Math.random() * 4) + 1, // 1-4
            vendorId: Math.floor(Math.random() * 65) + 1, // 1-65 vendors
            orderDate: formatDate(orderDate),
            shipDate: formatDate(shipDate),
            subTotal: subTotal,
            taxAmt: taxAmt,
            freight: freight,
            totalDue: totalDue,
            shipMethod: Math.floor(Math.random() * 5) + 1, // 1-5 ship methods
            employee: Math.floor(Math.random() * 112) + 1 // 1-112 employees
        });
    }
    
    return purchaseOrders;
}

// Function to generate purchase order details
function generatePurchaseOrderDetails(startPurchaseOrderId, count) {
    const details = [];
    let detailId = 1;
    
    for (let purchaseOrderId = startPurchaseOrderId; purchaseOrderId < startPurchaseOrderId + count; purchaseOrderId++) {
        // Each purchase order has 3-6 details
        const detailCount = Math.floor(Math.random() * 4) + 3; // 3-6 details per order
        
        for (let j = 0; j < detailCount; j++) {
            const orderQty = Math.floor(Math.random() * 50) + 1; // 1-50 quantity
            const unitPrice = Math.round((Math.random() * 100 + 5) * 100) / 100; // $5-$105
            const lineTotal = Math.round(orderQty * unitPrice * 100) / 100;
            
            // Due date is 1-30 days after order date
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 1);
            
            details.push({
                purchaseOrderDetailId: detailId++,
                purchaseOrderId: purchaseOrderId,
                dueDate: formatDate(dueDate),
                orderQty: orderQty,
                productId: Math.floor(Math.random() * 100) + 1, // 1-100 products
                unitPrice: unitPrice,
                lineTotal: lineTotal
            });
        }
    }
    
    return details;
}

// Generate the data
const newPurchaseOrders = generatePurchaseOrders(16, 500); // Start from ID 16, generate 500
const newPurchaseOrderDetails = generatePurchaseOrderDetails(16, 500);

// Read existing db.json
const dbPath = './mock-data/db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Add new purchase orders to existing array
db['purchase-orders'] = db['purchase-orders'].concat(newPurchaseOrders);

// Add new purchase order details to existing array
db['purchase-order-details'] = db['purchase-order-details'].concat(newPurchaseOrderDetails);

// Write back to file
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`Generated ${newPurchaseOrders.length} purchase orders`);
console.log(`Generated ${newPurchaseOrderDetails.length} purchase order details`);
console.log('Data has been added to mock-data/db.json'); 