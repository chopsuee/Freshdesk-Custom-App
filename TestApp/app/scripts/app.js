init();

async function init() {
  const client = await app.initialized();
  client.events.on("app.activated", () => renderText(client));
}

async function renderText(client) {
  const textElement = document.getElementById("apptext");
  const contactData = await client.data.get("contact");
  const {
    contact: { name },
  } = contactData;

  textElement.innerHTML = `Ticket is created by ${name}`;
  await fetchOrderStatus(client);
}

async function fetchOrderStatus(client, orderId) {
  const widget = document.getElementById('order-widget');

  try {
    console.log('Making API call with orderId:', orderId);
    const response = await client.request.invokeTemplate("getOrderStatus", {
      context: { orderId: orderId }
    });
    console.log('API response:', response);
    const orderData = JSON.parse(response.response);
    console.log('Parsed order data:', orderData);
    
    document.getElementById('order-id').textContent = `#${orderData.id}`;
    document.getElementById('product-name').textContent = orderData.product;
    document.getElementById('status-badge').textContent = orderData.status;
    document.getElementById('current-status-text').textContent = orderData.status;
    
    widget.style.display = 'block';
  } catch (error) {
    console.error("Full error details:", error);
    widget.style.display = 'none';
  }
}

window.trackOrder = async function() {
  const orderInput = document.getElementById('orderInput');
  const orderId = orderInput.value;
  if (!orderId) return;
  
  console.log('Searching for order ID:', orderId);
  const client = await app.initialized();
  await fetchOrderStatus(client, orderId);
  orderInput.value = '';
}
