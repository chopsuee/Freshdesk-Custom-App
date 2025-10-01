const express = require("express");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const app = express();
app.use(express.json());

// CORS middleware
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

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'healthy', service: 'express-orders' });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'healthy', service: 'express-orders' });
});

// DynamoDB setup
const client = new DynamoDBClient({ region: process.env.AWS_DEFAULT_REGION || "ap-southeast-1" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "orders";



// Create order
app.post("/orders", async (req, res) => {
  try {
    const { order_id, product_name, status } = req.body;
    if (!order_id || !product_name || !status) {
      return res.status(400).json({ message: "order_id, product_name, and status are required" });
    }
    
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: { order_id, product_name, status },
      ConditionExpression: "attribute_not_exists(order_id)"
    }));
    res.json({ order_id, product_name, status });
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      res.status(409).json({ message: "Order ID already exists" });
    } else {
      res.status(500).json({ message: "Error creating order" });
    }
  }
});

// Get order by ID
app.get("/orders/:id", async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { order_id: req.params.id }
    }));
    
    if (result.Item) {
      res.json(result.Item);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
});

// Update order status
app.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    const result = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { order_id: req.params.id },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":status": status },
      ConditionExpression: "attribute_exists(order_id)",
      ReturnValues: "ALL_NEW"
    }));
    
    res.json(result.Attributes);
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      res.status(404).json({ message: "Order not found" });
    } else {
      res.status(500).json({ message: "Error updating order status" });
    }
  }
});

// Update product
app.put("/orders/:id", async (req, res) => {
  try {
    const { product_name, status } = req.body;
    if (!product_name && !status) {
      return res.status(400).json({ message: "At least one field (product_name or status) is required" });
    }
    
    let updateExpression = "SET";
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};
    
    if (product_name) {
      updateExpression += " product_name = :product_name";
      expressionAttributeValues[":product_name"] = product_name;
    }
    
    if (status) {
      if (product_name) updateExpression += ",";
      updateExpression += " #status = :status";
      expressionAttributeNames["#status"] = "status";
      expressionAttributeValues[":status"] = status;
    }
    
    const result = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { order_id: req.params.id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length ? expressionAttributeNames : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: "attribute_exists(order_id)",
      ReturnValues: "ALL_NEW"
    }));
    
    res.json(result.Attributes);
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      res.status(404).json({ message: "Order not found" });
    } else {
      res.status(500).json({ message: "Error updating order" });
    }
  }
});

// Delete product
app.delete("/orders/:id", async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { order_id: req.params.id },
      ConditionExpression: "attribute_exists(order_id)"
    }));
    
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      res.status(404).json({ message: "Order not found" });
    } else {
      res.status(500).json({ message: "Error deleting order" });
    }
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
