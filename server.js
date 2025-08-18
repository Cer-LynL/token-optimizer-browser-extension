const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe (you'll need to set these environment variables)
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Middleware
app.use(cors({
  origin: ['chrome-extension://*', 'moz-extension://*', 'safari-web-extension://*'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'X-Extension-Version', 'X-Request-Source']
}));

app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// In-memory store (use Redis/Database in production)
const licenses = new Map();

// License validation endpoint
app.post('/v1/license/validate', async (req, res) => {
  try {
    const { license_key, source, version } = req.body;

    if (!license_key) {
      return res.status(400).json({
        valid: false,
        error: 'License key required'
      });
    }

    // Check if license exists in your database/store
    const license = licenses.get(license_key);
    
    if (!license) {
      return res.status(404).json({
        valid: false,
        error: 'License key not found'
      });
    }

    // Check if license is expired
    const now = new Date();
    const expiresAt = new Date(license.expires_at);
    
    if (expiresAt < now) {
      return res.json({
        valid: false,
        status: 'expired',
        error: 'License has expired',
        expires_at: license.expires_at
      });
    }

    // Valid license
    res.json({
      valid: true,
      status: 'active',
      expires_at: license.expires_at,
      plan: license.plan,
      features: license.features
    });

  } catch (error) {
    console.error('License validation error:', error);
    res.status(500).json({
      valid: false,
      error: 'Internal server error'
    });
  }
});

// Stripe webhook endpoint
app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Generate license key
      const licenseKey = generateLicenseKey();
      
      // Store license (use proper database in production)
      licenses.set(licenseKey, {
        customer_id: session.customer,
        email: session.customer_details.email,
        plan: 'pro',
        status: 'active',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        features: ['paraphrasing', 'templates', 'summarization', 'analytics', 'sensitive_detection']
      });
      
      console.log(`New Pro license created: ${licenseKey} for ${session.customer_details.email}`);
      
      // TODO: Send license key via email to customer
      // await sendLicenseKeyEmail(session.customer_details.email, licenseKey);
      
      break;
      
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      const subscription = event.data.object;
      
      // Find and deactivate license
      for (const [key, license] of licenses.entries()) {
        if (license.customer_id === subscription.customer) {
          license.status = 'cancelled';
          license.expires_at = new Date().toISOString();
          console.log(`License ${key} cancelled`);
          break;
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Generate license key
function generateLicenseKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [];
  
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 6; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  
  return segments.join('-');
}

// Test license creation endpoint (development only)
if (process.env.NODE_ENV !== 'production') {
  app.post('/dev/create-test-license', (req, res) => {
    const licenseKey = generateLicenseKey();
    
    licenses.set(licenseKey, {
      customer_id: 'test_customer',
      email: 'test@example.com',
      plan: 'pro',
      status: 'active',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      features: ['paraphrasing', 'templates', 'summarization', 'analytics', 'sensitive_detection']
    });
    
    res.json({
      license_key: licenseKey,
      message: 'Test license created successfully'
    });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Token Optimizer License Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Create test license: POST http://localhost:${PORT}/dev/create-test-license`);
  }
});

module.exports = app;