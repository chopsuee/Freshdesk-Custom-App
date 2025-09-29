
const express = require("express");

const app = express();
app.use(express.json());

// CORS middleware - allow all origins for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Mock orders
let orders = {
  "101": { id: "101", product: "Monitor", status: "pending" },
  "102": { id: "102", product: "Keyboard", status: "out for delivery" },
};

// Get order by ID
app.get("/orders/:id", (req, res) => {
  const order = orders[req.params.id];
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// Update order status
app.put("/orders/:id/status", (req, res) => {
  const order = orders[req.params.id];
  if (order) {
    order.status = req.body.status;
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
