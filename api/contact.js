/** Escape user-supplied text before it lands in the notification email's HTML body. */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const MAX_LENGTHS = { name: 120, email: 200, message: 5000 };

export default async function handler(req, res) {
  // Only this site needs to POST here, so don't advertise an open CORS policy.
  res.setHeader('Access-Control-Allow-Origin', 'https://my-portfolio-mm2c.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // req.body is undefined for a body-less POST; destructuring it directly threw a 500.
  const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (
    name.length > MAX_LENGTHS.name ||
    email.length > MAX_LENGTHS.email ||
    message.length > MAX_LENGTHS.message
  ) {
    return res.status(413).json({ error: 'One of the fields is too long.' });
  }

  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.error('Contact form is missing RESEND_API_KEY or EMAIL_FROM.');
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    message: escapeHtml(message).replace(/\r?\n/g, '<br/>'),
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: 'laila.mohamed.fikry@gmail.com',
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        html: `<p><strong>Name:</strong> ${safe.name}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>Message:</strong><br/>${safe.message}</p>`,
      }),
    });

    if (!response.ok) {
      // Log the upstream detail server-side; don't echo it to the client.
      const detail = await response.text().catch(() => '');
      console.error('Resend rejected the request:', response.status, detail);
      return res.status(502).json({ error: 'Failed to send email. Please try again later.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
}
