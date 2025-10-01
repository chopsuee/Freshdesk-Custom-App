resource "aws_dynamodb_table" "orders" {
  name           = "Freshdesk_Table_Orders"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "order_id"

  attribute {
    name = "order_id"
    type = "S"
  }

  tags = {
    Name = "Freshdesk Orders Table"
  }
}