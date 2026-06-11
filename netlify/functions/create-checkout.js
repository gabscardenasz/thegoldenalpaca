// Netlify Serverless Function — creates a Stripe Checkout session
// IMPORTANT: Add STRIPE_SECRET_KEY in Netlify → Site configuration → Environment variables

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Check secret key exists
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY not set in environment variables');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Stripe secret key not configured' })
    };
  }

  try {
    // Load Stripe inside the handler (Netlify bundles it from root package.json)
    const Stripe = require('stripe');
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    const {
      lineItems,
      customerEmail,
      customerName,
      shippingMethod,
      successUrl,
      cancelUrl,
    } = JSON.parse(event.body);

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        customer_name: customerName,
        shipping_method: shippingMethod,
      },
    };

    // Only add shipping collection if not in-store pickup
    if (shippingMethod !== 'pickup') {
      sessionParams.shipping_address_collection = {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'ES', 'MX', 'AR', 'CO', 'PE'],
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ sessionId: session.id }),
    };

  } catch (err) {
    console.error('Stripe error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
