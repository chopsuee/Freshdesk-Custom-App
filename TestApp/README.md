# Freshdesk Order Status App

A Freshdesk sidebar app that displays ticket requester information and fetches order status from an external API.

## Features

- Displays the name of the ticket requester
- Fetches and displays order details (ID, product, status) from external API
- Graceful error handling for API failures
- Reusable API request template

## Files Structure

```
.
├── README.md
├── app/
│   ├── index.html          # Main UI with order status display
│   ├── scripts/
│   │   └── app.js          # App logic and API integration
│   └── styles/
│       ├── images/
│       │   └── icon.svg
│       └── style.css
├── config/
│   ├── iparams.json        # Installation parameters
│   └── requests.json       # API request templates
└── manifest.json           # App configuration
```

## API Integration

The app integrates with:
- **Endpoint**: `http://express-alb-1767735639.ap-southeast-1.elb.amazonaws.com/orders/101`
- **Method**: GET
- **Response**: Order details (id, product, status)

## Request Template

The API call is configured as a reusable template `getOrderStatus` in `config/requests.json`:

```json
{
  "getOrderStatus": {
    "schema": {
      "protocol": "http",
      "method": "GET",
      "host": "express-alb-1767735639.ap-southeast-1.elb.amazonaws.com",
      "path": "/orders/101",
      "headers": {
        "Content-Type": "application/json"
      }
    }
  }
}
```

## How It Works

1. When the app activates in the ticket sidebar
2. Fetches and displays the ticket requester's name
3. Makes API call using the `getOrderStatus` template
4. Displays order information in format: "Order #[id]: [product] - Status: [status]"
5. Shows "Failed to load order status" on API errors

## Installation

1. Navigate to the app directory
2. Run `fdk run` to start the local development server
3. The app will be available in the Freshdesk ticket sidebar

## Error Handling

- API failures are caught and display user-friendly error messages
- Console logging for debugging API issues
- Graceful degradation when order data is unavailable