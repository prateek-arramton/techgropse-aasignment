# Async Transaction Processing System

A backend service built with **Node.js**, **Express.js**, **TypeScript**, **BullMQ**, and **Redis** that demonstrates asynchronous transaction processing, background job queues, idempotency, caching, analytics, and graceful shutdown.

> **Note:** This implementation uses an **in-memory data store** for users and transactions. The project is structured so that the storage layer can easily be replaced with MySQL or PostgreSQL in the future.

---

## Features

- Asynchronous transaction processing using BullMQ
- Redis-backed job queue
- Background worker
- Transaction idempotency
- Wallet balance validation
- Automatic retries with exponential backoff
- Redis caching
- Cache stampede protection
- Analytics endpoint
- Rate limiting
- Graceful shutdown
- TypeScript

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- BullMQ
- Redis
- Express Rate 

##ROUTES

http://localhost:3000/status
http://localhost:3000/v1/transactions

## PROJECT START GUIDE

command: npm run dev
Note: start redis locally before running project