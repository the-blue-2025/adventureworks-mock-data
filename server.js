const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./mock-data/db.json');
const middlewares = jsonServer.defaults();
const customMiddleware = require('./mock-data/middleware');

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes first
const routes = require('./mock-data/routes.json');
server.use(jsonServer.rewriter(routes));

// Add custom middleware after route rewriting
server.use(customMiddleware);

// Use default router
server.use('/api', router);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`🚀 JSON Server is running on http://localhost:${port}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET  /api/persons`);
  console.log(`   GET  /api/vendors`);
  console.log(`   GET  /api/purchase-orders`);
  console.log(`   GET  /api/purchase-orders/:id`);
  console.log(`   GET  /api/purchase-orders/:id/details`);
  console.log(`   GET  /api/ship-methods`);
  console.log(`   GET  /api/v1/territories`);
  console.log(`   GET  /api/purchase-order-details`);
  console.log(`   GET  /api/v1/sales-orders`);
  console.log(`   GET  /api/v1/sales-orders/:id`);
  console.log(`   GET  /api/v1/sales-orders/:id/details`);
  console.log(`   GET  /api/sales-order-details`);
  console.log(`\n🔧 Middleware enabled: CORS, logging, custom purchase order and sales order handling`);
}); 