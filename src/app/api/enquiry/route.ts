import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max requests per window
const RATE_WINDOW_MS = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// Clean old entries periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }, 300_000);
}

// Rate limit cleanup on process exit (for serverless, this is best-effort)
// The map lives in memory so cold starts start fresh, which is fine for low traffic

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str: string): string {
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    const body = await request.json();

    // Honeypot check
    if (body.honeypot) {
      // Silently accept — don't let bot know it was caught
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    const name = sanitize(body.name || '');
    const email = sanitize(body.email || '');
    const company = sanitize(body.company || '');
    const phone = sanitize(body.phone || '');
    const message = sanitize(body.message || '');
    const subject = sanitize(body.subject || 'Enquiry from PS Laboratories Website');
    const products = sanitize(body.products || '');
    const productCount = parseInt(body.productCount, 10) || 0;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required.' },
        { status: 400 },
      );
    }

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 },
      );
    }

    if (name.length > 200 || email.length > 200 || company.length > 200 || phone.length > 50) {
      return NextResponse.json(
        { error: 'One or more fields exceed the maximum length.' },
        { status: 400 },
      );
    }

    const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (!web3formsKey) {
      console.error('WEB3FORMS_ACCESS_KEY is not configured');
      return NextResponse.json(
        { error: 'Form submission is not configured. Please contact us directly via email.' },
        { status: 500 },
      );
    }

    // Build the Web3Forms payload
    const payload = {
      access_key: web3formsKey,
      subject,
      name,
      email,
      company,
      phone,
      message: `Products:\n${products || 'N/A'}\n\nProduct Count: ${productCount}\n\nMessage: ${message || 'N/A'}`,
      from_name: 'PS Laboratories Website',
    };

    const web3res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await web3res.json();

    if (!web3res.ok || !result.success) {
      console.error('Web3Forms error:', result);
      return NextResponse.json(
        { error: 'Failed to submit enquiry. Please try again or contact us directly.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Enquiry API error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 },
    );
  }
}
