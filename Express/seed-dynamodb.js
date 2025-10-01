const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "ap-southeast-1" });
const docClient = DynamoDBDocumentClient.from(client);

const mockOrders = [
  { order_id: "101", product_name: "Monitor", status: "pending" },
  { order_id: "102", product_name: "Keyboard", status: "out for delivery" },
  { order_id: "103", product_name: "Laptop", status: "delivered" }
];

async function seedData() {
  for (const order of mockOrders) {
    try {
      await docClient.send(new PutCommand({
        TableName: "orders",
        Item: order
      }));
      console.log(`Created order: ${order.order_id}`);
    } catch (error) {
      console.error(`Error creating order ${order.order_id}:`, error.message);
    }
  }
}

seedData();