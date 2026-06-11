exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error('STRIPE_SECRET_KEY not set');
    return { statusCode: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'STRIPE_SECRET_KEY not configured' }) };
  }

  try {
    const Stripe = require('stripe');
    const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
    const { lineItems, customerEmail, customerName, shippingMethod, successUrl, cancelUrl } = JSON.parse(event.body);

    console.log('Request:', JSON.stringify({ customerEmail, shippingMethod, itemCount: lineItems.length, successUrl, cancelUrl }));

    // Ensure all unit_amounts are valid integers >= 50 cents
    const validatedItems = lineItems.map(item => ({
      ...item,
      price_data: {
        ...item.price_data,
        unit_amount: Math.max(50, Math.round(Number(item.price_data.unit_amount)))
      }
    }));

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: validatedItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { customer_name: customerName || '', shipping_method: shippingMethod || '' },
    };

    if (customerEmail && customerEmail.includes('@')) {
      sessionParams.customer_email = customerEmail;
    }

    if (shippingMethod !== 'pickup') {
      sessionParams.shipping_address_collection = {
        allowed_countries: ['US','CA','GB','AU','ES','MX','AR','CO','PE'],
      };
    }

    console.log('Creating session with params:', JSON.stringify(sessionParams));
    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log('Session created successfully:', session.id);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ sessionId: session.id }),
    };

  } catch (err) {
    console.error('Stripe error:', err.type, err.message, err.param);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message, type: err.type, param: err.param }),
    };
  }
};
