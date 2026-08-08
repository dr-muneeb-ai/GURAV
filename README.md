# 🛒 E-Commerce App (MERN Stack)

A responsive e-commerce web application built using the MERN stack (MongoDB, Express.js, React, Node.js).

> **Note:** Product data is now managed entirely on the frontend via a JSON file. The backend provides authentication, cart synchronization, and order processing only; it no longer serves product lists or handles image uploads.

## 🔗 Live Demo

https://e-commerce-frontend-ten-rust.vercel.app/

## 📝 Product Management

- Open `frontend/src/data/products.json` to add or modify products manually.
- Each product entry should follow the structure shown in the commented example within the file.
- No backend API call is needed to fetch products—it's read locally by the React app.

## 🛂 User Authentication and Checkout Flow

- Users may add items to their cart without logging in.
- Attempting to place an order while unauthenticated will automatically
  redirect the user to the login/signup page.
- After a successful login or registration the user is returned to the
  checkout page, and any items previously added to the cart are preserved.
  The cart is also synchronized with the backend if a token is present.
