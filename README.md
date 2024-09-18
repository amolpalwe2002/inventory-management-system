# Inventory Management System

## Overview

This is a backend for an Inventory Management System allowing admins to manage stock levels and store managers to track inventory.

## Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file and add your MongoDB connection string and JWT secret.
4. Start the server with `npm run dev`.

## API Endpoints

### Auth

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login a user.

### Inventory

- `POST /api/inventory`: Add a new inventory item (Admin only).
- `PUT /api/inventory/:id`: Update an inventory item (Admin only).
- `DELETE /api/inventory/:id`: Delete an inventory item (Admin only).
- `GET /api/inventory`: Get all inventory items.

### Requests

- `POST /api/requests`: Request an inventory item (Store Manager only).
- `PATCH /api/requests/:id`: Approve or reject a request (Admin only).
- `GET /api/requests`: Get all requests (Admin only).

## Testing

Run tests using:

```bash
npm test
