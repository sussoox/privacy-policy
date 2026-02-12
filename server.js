require("dotenv").config();
const express = require("express");
const path = require("path");
const Stripe = require("stripe");

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const DOMAIN = process.env.DOMAIN || "http://localhost:4242";

app.use(express.static(path.join(__dirname)));

app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Payment succeeded for session:", session.id);
    // NOTE: In production, implement database logic here to mark user as paid.
    // Current demo version uses localStorage on client-side (see app.js).
  }

  res.json({ received: true });
});

app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: 500,
            product_data: {
              name: "TaskuDuuni julkaisuoikeus",
              description: "Julkaisuoikeus enintään 5 ilmoitukseen"
            }
          },
          quantity: 1
        }
      ],
      success_url: `${DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/cancel.html`
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/payment-status", async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) {
      return res.status(400).json({ error: "Missing session_id" });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({
      paid: session.payment_status === "paid",
      status: session.payment_status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`TaskuDuuni server running on ${PORT}`);
});
