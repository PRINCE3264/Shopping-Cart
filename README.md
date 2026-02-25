🛒 Shopping Cart  (Next.js)

A full-stack Shopify-style E-Commerce web application built using Next.js App Router, Prisma, and JWT authentication.
This project includes user authentication with OTP verification, product management, cart system, and order workflow.

🚀 Features

User registration & login with OTP verification

Secure authentication using JWT

Product listing & product details page

Shopping cart (add / remove / update items)

Checkout & order history

Email notifications using Nodemailer

Backend APIs using Next.js App Router

Database handled with Prisma ORM

Responsive UI

🧑‍💻 Tech Stack

Frontend: Next.js (App Router), TypeScript

Backend: Next.js API Routes

Database: MySQL / PostgreSQL

ORM: Prisma

Authentication: JWT + OTP

Email: Nodemailer

app/
 ├─ api/
 │   ├─ auth/
 │   ├─ products/
 │   ├─ cart/
 │   └─ orders/
 ├─ products/
 ├─ cart/
 ├─ checkout/
 └─ orders/

lib/
 ├─ prisma.ts
 ├─ auth.ts

prisma/
 ├─ schema.prisma


 git clone https://github.com/PRINCE3264/Shopping-Cart.git
cd Shopping-Cart


npm install


.env

DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password


npx prisma generate
npx prisma migrate dev


npm run dev  




📬 API Testing

You can test APIs using Postman:

POST /api/auth/register

POST /api/auth/login

POST /api/auth/verify-otp

GET /api/products

POST /api/cart

POST /api/orders

🎯 Purpose of Project

This project was built to:

Learn Next.js full-stack development

Understand authentication & OTP flows

Practice real-world e-commerce logic

Build a resume-ready full-stack project


