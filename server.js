require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Determine if we're in sandbox mode and set the base URL accordingly
const isSandbox = process.env.SANDBOX_MODE === 'true';
const API_BASE_URL = isSandbox
  ? process.env.PI_API_SANDBOX_URL
  : process.env.PI_API_URL;
const API_KEY = process.env.PI_API_KEY;

// Default route
app.get('/', (req, res) => {
  res.send('Pi Payment API is running...');
});

// Test Payment Endpoint for Sandbox Mode
app.post('/test-payment', async (req, res) => {
  // Prepare payment data (adjust these fields as needed per Pi API docs)
  const paymentData = {
    amount: req.body.amount || 1, // Default test amount
    currency: 'PI',
    description: 'Test transaction from Pi Payment Plugin in sandbox mode',
  };

  try {
    // Make a POST request to the Pi Payment API
    const response = await axios.post(
      `${API_BASE_URL}/payment`, // Use the correct endpoint for payments
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

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
