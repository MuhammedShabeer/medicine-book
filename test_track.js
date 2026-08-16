const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5217/api/auth/login', {
      username: 'admin',
      password: 'Admin@123'
    });
    const token = loginRes.data.token;
    console.log('Login success, got token');

    const trackRes = await axios.post('http://localhost:5217/api/analytics/track', {
      actionType: 'Search',
      details: 'Test search from node'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Track success:', trackRes.data);

  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}
test();
