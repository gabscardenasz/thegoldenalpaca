// Netlify Serverless Function — creates a Stripe Checkout session
// SETUP:
//   1. In Netlify dashboard → Site Settings → Environment Variables
//   2. Add variable: STRIPE_SECRET_KEY = sk_live_YOUR_SECRET_KEY
//   3. Never put your secret key in any file — only in Netlify environment variables

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const {
      lineItems,
      customerEmail,
      customerName,
      shippingMethod,
      successUrl,
      cancelUrl,
    } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      shipping_address_collection: shippingMethod !== 'pickup' ? {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'ES', 'MX', 'AR', 'CO', 'PE'],
      } : undefined,
      metadata: {
        customer_name: customerName,
        shipping_method: shippingMethod,
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id }),
    };

  } catch (err) {
    console.error('Stripe error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
