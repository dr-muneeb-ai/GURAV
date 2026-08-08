import nodemailer from "nodemailer";

// ============================================
// Transporter
// ============================================
// Uses Brevo (formerly Sendinblue) SMTP relay.
// BREVO_SMTP_USER / BREVO_SMTP_KEY come from:
// brevo.com -> Settings -> SMTP & API -> SMTP tab.
// BREVO_SMTP_KEY is a generated SMTP key, not your account password.

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Brevo uses STARTTLS on port 587, not implicit TLS
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

// Fail loudly at startup instead of silently failing on first order
transporter.verify((error) => {
  if (error) {
    console.log("Email transporter error:", error.message);
  } else {
    console.log("Email transporter ready");
  }
});

const STORE_NAME = "Drip District";
const currency = "A$";

// ============================================
// Helpers
// ============================================

const formatItemsRows = (items = []) =>
  items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.size || "-"}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${currency}${Number(item.price).toFixed(2)}</td>
      </tr>`
    )
    .join("");

const paymentMethodLabel = (method) => {
  if (method === "stripe") return "Stripe (Card)";
  if (method === "paypal") return "PayPal";
  return "Cash On Delivery";
};

// ============================================
// Customer Email
// ============================================

export const sendCustomerOrderEmail = async (order) => {
  try {
    const { address, items, amount, paymentMethod, status, _id } = order;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222;">
        <h1 style="color:#B9572C;">${STORE_NAME}</h1>
        <p>Hi ${address?.firstName || "there"},</p>
        <p>Your order has been successfully placed. Thank you for shopping with us!</p>

        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr>
            <td style="padding:4px 0;"><strong>Order ID:</strong></td>
            <td style="padding:4px 0;">${_id}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;"><strong>Payment Method:</strong></td>
            <td style="padding:4px 0;">${paymentMethodLabel(paymentMethod)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;"><strong>Order Status:</strong></td>
            <td style="padding:4px 0;">${status}</td>
          </tr>
        </table>

        <h3>Items</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:8px;text-align:left;">Product</th>
              <th style="padding:8px;">Size</th>
              <th style="padding:8px;">Qty</th>
              <th style="padding:8px;text-align:right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${formatItemsRows(items)}
          </tbody>
        </table>

        <h2 style="text-align:right;color:#B9572C;">Total: ${currency}${Number(amount).toFixed(2)}</h2>

        <h3>Delivery Address</h3>
        <p>
          ${address?.firstName} ${address?.lastName}<br/>
          ${address?.street}<br/>
          ${address?.city}, ${address?.state} ${address?.pinCode}<br/>
          ${address?.country}<br/>
          Phone: ${address?.phone}
        </p>

        <p style="margin-top:30px;">Need help with your order? Contact us at
          <a href="mailto:${process.env.EMAIL_FROM}">${process.env.EMAIL_FROM}</a>.
        </p>

        <p style="color:#999;font-size:12px;margin-top:30px;">
          &copy; ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${STORE_NAME}" <${process.env.EMAIL_FROM}>`,
      to: address?.email,
      subject: `Order Confirmed - ${STORE_NAME} (#${_id})`,
      html,
    });
  } catch (error) {
    // Never let an email failure break the order flow
    console.log("Customer email failed:", error.message);
  }
};

// ============================================
// Admin Email
// ============================================

export const sendAdminOrderEmail = async (order) => {
  try {
    const { address, items, amount, paymentMethod, _id } = order;

    if (!process.env.ADMIN_EMAIL) return;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222;">
        <h1 style="color:#B9572C;">New Order Received on ${STORE_NAME}</h1>

        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr><td style="padding:4px 0;"><strong>Order ID:</strong></td><td>${_id}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Customer:</strong></td><td>${address?.firstName} ${address?.lastName}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Email:</strong></td><td>${address?.email}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Phone:</strong></td><td>${address?.phone}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Address:</strong></td><td>${address?.street}, ${address?.city}, ${address?.state} ${address?.pinCode}, ${address?.country}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Payment Method:</strong></td><td>${paymentMethodLabel(paymentMethod)}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Total Amount:</strong></td><td>${currency}${Number(amount).toFixed(2)}</td></tr>
        </table>

        <h3>Items</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:8px;text-align:left;">Product</th>
              <th style="padding:8px;">Size</th>
              <th style="padding:8px;">Qty</th>
              <th style="padding:8px;text-align:right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${formatItemsRows(items)}
          </tbody>
        </table>
      </div>
    `;

    await transporter.sendMail({
      from: `"${STORE_NAME} System" <${process.env.EMAIL_FROM}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received on ${STORE_NAME} (#${_id})`,
      html,
    });
  } catch (error) {
    console.log("Admin email failed:", error.message);
  }
};
