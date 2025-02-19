const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Determine sandbox or production mode
const isSandbox = process.env.SANDBOX_MODE === 'true';
const API_BASE_URL = isSandbox
  ? process.env.PI_API_SANDBOX_URL
  : process.env.PI_API_URL;
const API_KEY = process.env.PI_API_KEY;

// Create an HTTPS agent that ignores certificate errors (development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

app.get('/', (req, res) => {
  res.send('Pi Payment API is running...');
});

app.post('/test-payment', async (req, res) => {
  const paymentData = {
    amount: req.body.amount || 1,
    currency: 'PI',
    description: 'Test transaction from Pi Payment Plugin in sandbox mode',
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/payment`, paymentData, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      httpsAgent: httpsAgent, // Bypass SSL certificate validation (development only)
    });
    console.log('Sandbox payment response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      'Error during sandbox payment:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: 'Payment test failed',
      details: error.response ? error.response.data : error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
