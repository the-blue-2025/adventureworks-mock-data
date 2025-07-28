module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Helper function to disable caching
  const disableCaching = () => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
  };
  
  // Helper function to get database
  const getDb = () => require('./db.json');
  
  // Helper function to handle sales order details
  const handleSalesOrderDetails = (salesOrderId) => {
    const db = getDb();
    const details = db['sales-order-details'].filter(detail => detail.salesOrderId === salesOrderId);
    res.json(details);
  };
  
  // Helper function to handle single sales order with details
  const handleSingleSalesOrder = (salesOrderId) => {
    console.log('Directly handling sales order with details for ID:', salesOrderId);
    disableCaching();
    
    const db = getDb();
    
    // Find the sales order
    const salesOrder = db['sales-order-headers'].find(so => so.salesOrderId === salesOrderId);
    if (!salesOrder) {
      res.status(404).json({ error: 'Sales order not found' });
      return;
    }
    
    // Find the customer
    const customer = db.persons.find(p => p.businessEntityId === salesOrder.customerId);
    
    // Find the sales person
    const salesPerson = db.persons.find(p => p.businessEntityId === salesOrder.salesPersonId);
    
    // Find the territory
    const territory = db.territories.find(t => t.territoryId === salesOrder.territoryId);
    
    // Find the details
    const details = db['sales-order-details'].filter(detail => detail.salesOrderId === salesOrderId);
    console.log('Found details count:', details.length);
    
    // Create the response
    const response = {
      ...salesOrder,
      customer: customer ? {
        businessEntityId: customer.businessEntityId,
        firstName: customer.firstName,
        lastName: customer.lastName,
        title: customer.title,
        fullName: `${customer.title || ''} ${customer.firstName} ${customer.lastName}`.trim()
      } : undefined,
      salesPerson: salesPerson ? {
        businessEntityId: salesPerson.businessEntityId,
        firstName: salesPerson.firstName,
        lastName: salesPerson.lastName,
        title: salesPerson.title,
        fullName: `${salesPerson.title || ''} ${salesPerson.firstName} ${salesPerson.lastName}`.trim()
      } : undefined,
      territory: territory ? {
        territoryId: territory.territoryId,
        name: territory.name,
        countryRegionCode: territory.countryRegionCode,
        group: territory.group
      } : undefined,
      salesOrderDetails: details
    };
    
    console.log('Sending response with', details.length, 'details');
    res.json(response);
  };
  
  // Helper function to handle sales orders list
  const handleSalesOrdersList = () => {
    console.log('Directly handling sales orders list request:', req.url);
    disableCaching();
    
    const db = getDb();
    
    // Get all sales orders
    const salesOrders = db['sales-order-headers'];
    
    // Add customer, sales person, and territory information to each sales order
    const ordersWithDetails = salesOrders.map(order => {
      const customer = db.persons.find(p => p.businessEntityId === order.customerId);
      const salesPerson = db.persons.find(p => p.businessEntityId === order.salesPersonId);
      const territory = db.territories.find(t => t.territoryId === order.territoryId);
      
      return {
        ...order,
        customer: customer ? {
          businessEntityId: customer.businessEntityId,
          firstName: customer.firstName,
          lastName: customer.lastName,
          title: customer.title,
          fullName: `${customer.title || ''} ${customer.firstName} ${customer.lastName}`.trim()
        } : undefined,
        salesPerson: salesPerson ? {
          businessEntityId: salesPerson.businessEntityId,
          firstName: salesPerson.firstName,
          lastName: salesPerson.lastName,
          title: salesPerson.title,
          fullName: `${salesPerson.title || ''} ${salesPerson.firstName} ${salesPerson.lastName}`.trim()
        } : undefined,
        territory: territory ? {
          territoryId: territory.territoryId,
          name: territory.name,
          countryRegionCode: territory.countryRegionCode,
          group: territory.group
        } : undefined
      };
    });
    
    console.log('Sending sales orders list with customer, sales person, and territory information for', ordersWithDetails.length, 'orders');
    res.json(ordersWithDetails);
  };
  
  // Helper function to handle purchase order details
  const handlePurchaseOrderDetails = (purchaseOrderId) => {
    const db = getDb();
    const details = db['purchase-order-details'].filter(detail => detail.purchaseOrderId === purchaseOrderId);
    res.json(details);
  };
  
  // Helper function to handle single purchase order with details
  const handleSinglePurchaseOrder = (purchaseOrderId) => {
    console.log('Directly handling purchase order with details for ID:', purchaseOrderId);
    disableCaching();
    
    const db = getDb();
    
    // Find the purchase order
    const purchaseOrder = db['purchase-orders'].find(po => po.purchaseOrderId === purchaseOrderId);
    if (!purchaseOrder) {
      res.status(404).json({ error: 'Purchase order not found' });
      return;
    }
    
    // Find the vendor
    const vendor = db.vendors.find(v => v.businessEntityId === purchaseOrder.vendorId);
    
    // Find the details
    const details = db['purchase-order-details'].filter(detail => detail.purchaseOrderId === purchaseOrderId);
    console.log('Found details count:', details.length);
    
    // Create the response
    const response = {
      ...purchaseOrder,
      vendor: vendor ? {
        businessEntityId: vendor.businessEntityId,
        name: vendor.name,
        accountNumber: vendor.accountNumber
      } : undefined,
      purchaseOrderDetails: details
    };
    
    console.log('Sending response with', details.length, 'details');
    res.json(response);
  };
  
  // Helper function to handle purchase orders list
  const handlePurchaseOrdersList = () => {
    console.log('Directly handling purchase orders list request:', req.url);
    disableCaching();
    
    const db = getDb();
    
    // Get all purchase orders
    const purchaseOrders = db['purchase-orders'];
    
    // Add vendor information to each purchase order
    const ordersWithVendors = purchaseOrders.map(order => {
      const vendor = db.vendors.find(v => v.businessEntityId === order.vendorId);
      return {
        ...order,
        vendor: vendor ? {
          businessEntityId: vendor.businessEntityId,
          name: vendor.name,
          accountNumber: vendor.accountNumber
        } : undefined
      };
    });
    
    console.log('Sending purchase orders list with vendor information for', ordersWithVendors.length, 'orders');
    res.json(ordersWithVendors);
  };
  
  // Purchase Order Handlers
  if (req.method === 'GET' && req.url.match(/^\/purchase-orders\/\d+\/details$/)) {
    const purchaseOrderId = parseInt(req.url.match(/\/purchase-orders\/(\d+)\/details/)[1]);
    handlePurchaseOrderDetails(purchaseOrderId);
    return;
  }
  
  if (req.method === 'GET' && req.url.match(/^\/purchase-orders\/\d+$/)) {
    const purchaseOrderId = parseInt(req.url.match(/\/purchase-orders\/(\d+)/)[1]);
    handleSinglePurchaseOrder(purchaseOrderId);
    return;
  }
  
  if (req.method === 'GET' && (req.url === '/purchase-orders' || req.url === '/purchase-orders/')) {
    handlePurchaseOrdersList();
    return;
  }
  
  // Sales Order Handlers - consolidated patterns
  if (req.method === 'GET' && req.url.match(/^\/(api\/v1\/)?(v1\/)?sales-orders\/\d+\/details$/)) {
    const salesOrderId = parseInt(req.url.match(/\/(?:api\/v1\/)?(?:v1\/)?sales-orders\/(\d+)\/details/)[1]);
    handleSalesOrderDetails(salesOrderId);
    return;
  }
  
  if (req.method === 'GET' && req.url.match(/^\/(api\/v1\/)?(v1\/)?sales-orders\/\d+$/)) {
    const salesOrderId = parseInt(req.url.match(/\/(?:api\/v1\/)?(?:v1\/)?sales-orders\/(\d+)/)[1]);
    console.log('✅ Single sales order handler triggered for URL:', req.url, 'ID:', salesOrderId);
    handleSingleSalesOrder(salesOrderId);
    return;
  }
  
  if (req.method === 'GET' && req.url.match(/^\/sales-order-headers\/\d+$/)) {
    const salesOrderId = parseInt(req.url.match(/\/sales-order-headers\/(\d+)/)[1]);
    console.log('✅ Single sales order handler triggered for rewritten URL:', req.url, 'ID:', salesOrderId);
    handleSingleSalesOrder(salesOrderId);
    return;
  }
  
  if (req.method === 'GET' && (req.url === '/sales-orders' || req.url === '/sales-orders/' || 
                                req.url === '/v1/sales-orders' || req.url === '/v1/sales-orders/' ||
                                req.url === '/api/v1/sales-orders' || req.url === '/api/v1/sales-orders/' ||
                                req.url === '/sales-order-headers' || req.url === '/sales-order-headers/')) {
    console.log('✅ Sales orders list handler triggered for URL:', req.url);
    handleSalesOrdersList();
    return;
  }
  
  next();
}; 