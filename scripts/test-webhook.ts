import axios from "axios";
import { timeStamp } from "console";
import { json } from "stream/consumers";

async function sendTestWebhook() {
  try {
     const response = await axios.post('http://localhost:3000/api/webhooks/test', {
      event: 'test_event',
      timeStamp: new Date().toISOString(),
      data: {
        id: Math.random().toString(36).substring(7),
        value: Math.floor(Math.random() * 100)
      }
     }, {
      headers: {
        'X-Test-Header': 'test-value',
        'Content-Type': 'application/json'
      }
     });

     console.log('webhook sent successfully:', {
      status: response.status,
      data: response.data
     })

  } catch (error: any) {

    console.error('error sending webhook:', error.response?.data || error.message);

  }
}

// to send test webhooks

async function runTests() {
  for (let i = 0; i < 3; i++) {
    console.log(`\nsending test webhook ${i + 1}...`);
    await sendTestWebhook();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

runTests();