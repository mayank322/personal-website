// app/api/whatsapp/webhook/route.js

const WHATSAPP_API_VERSION = 'v21.0';

async function sendWhatsAppMessage(to, text) {
  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  });
  const data = await res.json().catch(() => null);
  // TEMP DEBUG — remove once send is confirmed working.
  console.log('WhatsApp send response:', res.status, JSON.stringify(data));
}

// Meta calls this once (GET) when you register the webhook, to verify you own the endpoint.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

// Meta calls this (POST) every time a message/status update comes in.
export async function POST(request) {
  try {
    const body = await request.json();

    // TEMP DEBUG — remove once we confirm the payload shape.
    console.log('WhatsApp webhook payload:', JSON.stringify(body));

    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message) {
      // Delivery/read status updates land here too — nothing to do with those yet.
      return Response.json({ success: true });
    }

    const from = message.from; // sender's phone number, e.g. "919928019089"
    const type = message.type; // 'text' | 'audio' | 'image' | 'document' | ...

    // Placeholder reply so we can confirm the pipe works end to end.
    // Voice transcription, LLM parsing, and Upstash writes get layered in next.
    let replyText = `Got it — received a "${type}" message. Parsing isn't wired up yet.`;
    if (type === 'text') {
      replyText = `Got your message: "${message.text.body}". Parsing isn't wired up yet.`;
    }

    await sendWhatsAppMessage(from, replyText);

    return Response.json({ success: true });
  } catch (err) {
    console.error('WhatsApp webhook error:', err);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
