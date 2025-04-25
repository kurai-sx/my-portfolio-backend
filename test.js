const axios = require('axios');

const testData = {
  Name: "Test User",
  Email: "test@example.com",
  Message: "This is a test message"
};

async function testEndpoint() {
  try {
    const response = await axios.post('http://localhost:5000/api/contact', testData);
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testEndpoint(); 