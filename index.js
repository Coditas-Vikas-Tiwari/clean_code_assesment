const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Sample initial product and order data (you can use a database for production)
let products = [
  { id: 1, name: 'Product 1', price: 10 },
  { id: 2, name: 'Product 2', price: 20 },
];

let orders = [];

// Middleware to parse request bodies
app.use(bodyParser.json());

// Routes for handling operations

// Add a new product
app.post('/products', (req, res) => {
  try {
    const { id, name, price } = req.body;
    if (!id || !name || !price) {
      throw new Error('Missing required fields');
    }
    const newProduct = { id, name, price };
    products.push(newProduct);
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove a product
app.delete('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const productIndex = products.findIndex((product) => product.id === parseInt(id));
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    products.splice(productIndex, 1);
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Place an order
app.post('/orders', (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      throw new Error('Missing required fields');
    }
    const product = products.find((product) => product.id === parseInt(productId));
    if (!product) {
      throw new Error('Product not found');
    }
    const order = { productId, quantity, totalPrice: product.price * quantity };
    orders.push(order);
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel an order
app.delete('/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const orderIndex = orders.findIndex((order) => order.orderId === parseInt(orderId));
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    orders.splice(orderIndex, 1);
    res.json({ message: 'Order canceled successfully' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// List all products
app.get('/products', (req, res) => {
  res.json(products);
});

// List all orders
app.get('/orders', (req, res) => {
  res.json(orders);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
