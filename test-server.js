const http = require('http');

const baseUrl = 'http://localhost:3000/api';

const endpoints = [
  '/persons',
  '/vendors', 
  '/purchase-orders',
  '/ship-methods',
  '/purchase-order-details'
];

function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}${endpoint}`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`✅ ${endpoint}: ${jsonData.length} records`);
          resolve({ endpoint, status: res.statusCode, count: jsonData.length });
        } catch (error) {
          console.log(`❌ ${endpoint}: Failed to parse JSON`);
          reject(error);
        }
      });
    }).on('error', (error) => {
      console.log(`❌ ${endpoint}: ${error.message}`);
      reject(error);
    });
  });
}

async function runTests() {
  console.log('🧪 Testing JSON Server endpoints...\n');
  
  try {
    const results = await Promise.all(endpoints.map(testEndpoint));
    
    console.log('\n📊 Test Results:');
    results.forEach(result => {
      console.log(`   ${result.endpoint}: ${result.count} records (${result.status})`);
    });
    
    console.log('\n🎉 All endpoints are working correctly!');
    console.log('\n🚀 Server is ready for development.');
    console.log('   You can now use these endpoints in your Angular application.');
    
  } catch (error) {
    console.log('\n❌ Some tests failed:', error.message);
  }
}

// Wait a bit for server to start, then run tests
setTimeout(runTests, 2000); 