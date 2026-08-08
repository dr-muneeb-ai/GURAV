import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import {
  sendCustomerOrderEmail,
  sendAdminOrderEmail,
} from "../config/email.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const COD_FEE = 5; // A$5 fixed handling fee, COD only

// ============================================
// Shared Helpers
// ============================================

// Attach category to each cart item from the Product collection
const buildOrderItems = async (items) => {
  return Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item._id || item.productId);

      return {
        productId: item._id || item.productId,
        name: item.name,
        category: product?.category || "Others",
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
      };
    })
  );
};

// Fire both notification emails without ever throwing back into the request flow
const notifyOrder = async (order) => {
  await Promise.all([
    sendCustomerOrderEmail(order),
    sendAdminOrderEmail(order),
  ]);
};

// ============================================
// PayPal Helpers
// ============================================

const PAYPAL_API =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const getPaypalAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || "PayPal auth failed");
  }

  return data.access_token;
};

// ============================================
// Place Order (Cash On Delivery)
// ============================================

const placeOrder = async (req, res) => {
  try {
    const { items, address, amount } = req.body;

    if (!items || items.length === 0) {
      return res.json({
        success: false,
        message: "Cart is empty",
      });
    }

    const updatedItems = await buildOrderItems(items);

    // amount coming from the frontend already includes the COD fee
    // (see PlaceOrder.jsx / Payment.jsx) — we just record the fee separately
    // for reporting purposes.
    const order = await Order.create({
      userId: req.user.id,
      items: updatedItems,
      address,
      amount,
      codFee: COD_FEE,
      paymentMethod: "cod",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    });

    // Don't block the response on email sending
    notifyOrder(order);

    return res.json({
      success: true,
      message: "Order Placed Successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// Stripe Payment
// ============================================

const stripePayment = async (req, res) => {
  try {
    const { items, address, amount } = req.body;

    if (!items || items.length === 0) {
      return res.json({
        success: false,
        message: "Cart is empty",
      });
    }

    const updatedItems = await buildOrderItems(items);

    const order = await Order.create({
      userId: req.user.id,
      items: updatedItems,
      address,
      amount,
      codFee: 0,
      paymentMethod: "stripe",
      payment: false,
      status: "Pending Payment",
      date: Date.now(),
    });

    const line_items = updatedItems.map((item) => ({
      price_data: {
        currency: "aud",
        product_data: {
          name: item.name,
          images:
            item.image && item.image.length ? [item.image[0]] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Delivery fee = whatever is left of `amount` after summing item totals
    const itemsTotal = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const deliveryFee = Math.max(amount - itemsTotal, 0);

    if (deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: "aud",
          product_data: { name: "Delivery Fee" },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      // {CHECKOUT_SESSION_ID} is filled in by Stripe automatically
      success_url: `${process.env.CLIENT_URL}/orders?success=true&method=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment`,
      customer_email: address?.email,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    return res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// PayPal Payment
// ============================================

const paypalPayment = async (req, res) => {
  try {
    const { items, address, amount } = req.body;

    if (!items || items.length === 0) {
      return res.json({
        success: false,
        message: "Cart is empty",
      });
    }

    const updatedItems = await buildOrderItems(items);

    const order = await Order.create({
      userId: req.user.id,
      items: updatedItems,
      address,
      amount,
      codFee: 0,
      paymentMethod: "paypal",
      payment: false,
      status: "Pending Payment",
      date: Date.now(),
    });

    const accessToken = await getPaypalAccessToken();

    const paypalResponse = await fetch(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: order._id.toString(),
              amount: {
                currency_code: "AUD",
                value: Number(amount).toFixed(2),
              },
            },
          ],
          application_context: {
            brand_name: "Drip District",
            return_url: `${process.env.CLIENT_URL}/orders?success=true&method=paypal`,
            cancel_url: `${process.env.CLIENT_URL}/payment`,
            user_action: "PAY_NOW",
          },
        }),
      }
    );

    const paypalData = await paypalResponse.json();

    if (!paypalResponse.ok) {
      throw new Error(paypalData.message || "PayPal order creation failed");
    }

    // Store the PayPal order id so we can verify/capture it later
    order.transactionId = paypalData.id;
    await order.save();

    const approvalLink = paypalData.links?.find(
      (link) => link.rel === "approve"
    );

    return res.json({
      success: true,
      approval_url: approvalLink?.href,
      paypalOrderId: paypalData.id,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// Verify Payment (Stripe & PayPal)
// ============================================
// Called by the frontend after the customer returns from Stripe Checkout
// or PayPal Checkout, before showing the order as paid.

const verifyPayment = async (req, res) => {
  try {
    const { method, session_id, paypalOrderId } = req.body;

    if (method === "stripe") {
      if (!session_id) {
        return res.json({
          success: false,
          message: "Missing Stripe session id",
        });
      }

      const session = await stripe.checkout.sessions.retrieve(session_id);

      const order = await Order.findById(session.metadata?.orderId);

      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }

      if (session.payment_status !== "paid") {
        return res.json({
          success: false,
          message: "Payment not completed",
        });
      }

      if (!order.payment) {
        order.payment = true;
        order.paymentMethod = "stripe";
        order.transactionId = session.payment_intent;
        order.paymentDate = Date.now();
        order.status = "Order Placed";
        await order.save();

        notifyOrder(order);
      }

      return res.json({ success: true, order });
    }

    if (method === "paypal") {
      if (!paypalOrderId) {
        return res.json({
          success: false,
          message: "Missing PayPal order id",
        });
      }

      const order = await Order.findOne({ transactionId: paypalOrderId });

      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }

      const accessToken = await getPaypalAccessToken();

      const captureResponse = await fetch(
        `${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const captureData = await captureResponse.json();

      const capturedOk =
        captureResponse.ok &&
        (captureData.status === "COMPLETED" ||
          captureData.purchase_units?.[0]?.payments?.captures?.[0]
            ?.status === "COMPLETED");

      if (!capturedOk) {
        return res.json({
          success: false,
          message: captureData.message || "PayPal capture failed",
        });
      }

      if (!order.payment) {
        const captureId =
          captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id ||
          paypalOrderId;

        order.payment = true;
        order.paymentMethod = "paypal";
        order.transactionId = captureId;
        order.paymentDate = Date.now();
        order.status = "Order Placed";
        await order.save();

        notifyOrder(order);
      }

      return res.json({ success: true, order });
    }

    return res.json({ success: false, message: "Invalid payment method" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// User Orders
// ============================================

const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// Admin All Orders
// ============================================

const allOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    let filter = {};

    if (req.query.search) {
      filter = {
        $or: [
          {
            "address.firstName": {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            "address.lastName": {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            "address.email": {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            status: {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            paymentMethod: {
              $regex: req.query.search,
              $options: "i",
            },
          },
        ],
      };
    }

    const totalOrders = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// Update Status
// ============================================

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
      }
    );

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      message: "Status Updated Successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// Delete Order
// ============================================

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      message: "Order Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// Exports
// ============================================

export {
  placeOrder,
  stripePayment,
  paypalPayment,
  verifyPayment,
  userOrders,
  allOrders,
  updateOrderStatus,
  deleteOrder,
};
