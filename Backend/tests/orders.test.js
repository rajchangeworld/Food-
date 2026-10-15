import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { Menu } from '../src/models/Menu.js';
import { User } from '../src/models/User.js';
import { Order } from '../src/models/Order.js';
import { signToken } from '../src/middleware/auth.js';

describe('Order Management API (/api/orders)', () => {
  let user1, token1;
  let user2, token2;
  let adminUser, adminToken;
  let burgerItem, pizzaItem, unavailableItem;

  beforeEach(async () => {
    // Users
    user1 = await User.create({ phone: '+15551112222', name: 'Alice Walker', role: 'customer' });
    token1 = signToken({ id: user1._id.toString(), phone: user1.phone, role: 'customer' });

    user2 = await User.create({ phone: '+15553334444', name: 'Bob Smith', role: 'customer' });
    token2 = signToken({ id: user2._id.toString(), phone: user2.phone, role: 'customer' });

    adminUser = await User.create({ phone: '+15559990000', name: 'Site Admin', role: 'admin' });
    adminToken = signToken({ id: adminUser._id.toString(), phone: adminUser.phone, role: 'admin' });

    // Menu Items
    burgerItem = await Menu.create({
      itemId: 'b1',
      name: 'Smoky Angus Beast Burger',
      category: 'Burger',
      description: 'Juicy 100% Angus beef patty',
      price: 13.99,
      image: 'https://images.unsplash.com/burger.jpg',
      isAvailable: true,
      options: [{ name: 'Extra Cheddar Cheese', price: 1.5 }],
    });

    pizzaItem = await Menu.create({
      itemId: 'p1',
      name: 'Artisan Burrata & Pepperoni Pizza',
      category: 'Pizza',
      description: 'Slow-fermented pizza',
      price: 17.99,
      image: 'https://images.unsplash.com/pizza.jpg',
      isAvailable: true,
    });

    unavailableItem = await Menu.create({
      itemId: 'sold-out-1',
      name: 'Seasonal Truffle Risotto',
      category: 'Specials',
      description: 'Sold out item',
      price: 25.0,
      image: 'https://images.unsplash.com/risotto.jpg',
      isAvailable: false,
    });
  });

  it('should create an order and calculate totals strictly server-side', async () => {
    const payload = {
      items: [
        {
          id: 'b1',
          quantity: 2,
          selectedOptions: [{ name: 'Extra Cheddar Cheese', price: 1.5 }],
        },
      ],
      customerName: 'Alice Walker',
      phoneNumber: '+15551112222',
      deliveryAddress: {
        street: '123 Ocean Blvd',
        city: 'Metro City',
      },
      // Client sends a fake low total to test server-side tampering prevention
      total: 1.0,
    };

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token1}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderId).toMatch(/^CRV-\d+/);
    expect(res.body.data.status).toBe('Order Received');

    // Verification of server price math:
    // (13.99 + 1.50) * 2 = 15.49 * 2 = 30.98 subtotal
    // Subtotal < 35 => deliveryFee = 2.99
    // packagingFee = 1.50
    // grandTotal = 30.98 + 2.99 + 1.50 = 35.47
    expect(res.body.data.subtotal).toBe(30.98);
    expect(res.body.data.deliveryFee).toBe(2.99);
    expect(res.body.data.packagingFee).toBe(1.5);
    expect(res.body.data.grandTotal).toBe(35.47);
    expect(res.body.data.total).toBe(35.47); // Frontend property alias
  });

  it('should reject an order with an empty cart or invalid quantities', async () => {
    // Empty cart
    const resEmpty = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        items: [],
        customerName: 'Alice',
        phoneNumber: '+15551112222',
        deliveryAddress: { street: '123 St', city: 'City' },
      });
    expect(resEmpty.status).toBe(400);

    // Invalid zero/negative quantity
    const resZeroQty = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        items: [{ id: 'b1', quantity: 0 }],
        customerName: 'Alice',
        phoneNumber: '+15551112222',
        deliveryAddress: { street: '123 St', city: 'City' },
      });
    expect(resZeroQty.status).toBe(400);
  });

  it('should reject an order containing unavailable food items', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        items: [{ id: 'sold-out-1', quantity: 1 }],
        customerName: 'Alice',
        phoneNumber: '+15551112222',
        deliveryAddress: { street: '123 St', city: 'City' },
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('unavailable');
  });

  it('should list only the authenticated user orders', async () => {
    // Create order for user 1
    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        items: [{ id: 'b1', quantity: 1 }],
        customerName: 'Alice',
        phoneNumber: '+15551112222',
        deliveryAddress: { street: '123 St', city: 'City' },
      });

    // Create order for user 2
    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        items: [{ id: 'p1', quantity: 1 }],
        customerName: 'Bob',
        phoneNumber: '+15553334444',
        deliveryAddress: { street: '456 Ave', city: 'City' },
      });

    // User 1 requests orders
    const resUser1 = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token1}`);

    expect(resUser1.status).toBe(200);
    expect(resUser1.body.orders).toHaveLength(1);
    expect(resUser1.body.orders[0].items[0].name).toBe('Smoky Angus Beast Burger');
  });

  it('should prevent access to another user order', async () => {
    // User 1 creates an order
    const createRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        items: [{ id: 'b1', quantity: 1 }],
        customerName: 'Alice',
        phoneNumber: '+15551112222',
        deliveryAddress: { street: '123 St', city: 'City' },
      });

    const orderId = createRes.body.data.orderId;

    // User 2 tries to access user 1's order
    const forbiddenRes = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(forbiddenRes.status).toBe(403);
    expect(forbiddenRes.body.message).toContain('not authorized');

    // Admin can access user 1's order
    const adminRes = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminRes.status).toBe(200);
  });

  it('should validate status transitions and update status history', async () => {
    // User creates order
    const createRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        items: [{ id: 'b1', quantity: 1 }],
        customerName: 'Alice',
        phoneNumber: '+15551112222',
        deliveryAddress: { street: '123 St', city: 'City' },
      });

    const orderId = createRes.body.data.orderId;

    // Valid transition: Order Received -> Preparing (by admin)
    const step1 = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Preparing', note: 'Kitchen started cooking' });

    expect(step1.status).toBe(200);
    expect(step1.body.data.status).toBe('Preparing');

    // Invalid transition: Preparing -> Delivered (must go to 'Out for Delivery' first)
    const invalidStep = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Delivered' });

    expect(invalidStep.status).toBe(400);
    expect(invalidStep.body.message).toContain('Invalid status transition');

    // Valid transition: Preparing -> Out for Delivery
    const step2 = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Out for Delivery' });
    expect(step2.status).toBe(200);

    // Valid transition: Out for Delivery -> Delivered
    const step3 = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Delivered' });
    expect(step3.status).toBe(200);

    // Delivered is terminal: cannot transition further
    const step4 = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Cancelled' });
    expect(step4.status).toBe(400);

    // Check status history entries
    const updatedOrder = await Order.findOne({ orderId });
    expect(updatedOrder.statusHistory.length).toBeGreaterThanOrEqual(4);
  });

  it('should allow customer to cancel order while still Order Received or Preparing', async () => {
    const createRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        items: [{ id: 'b1', quantity: 1 }],
        customerName: 'Alice',
        phoneNumber: '+15551112222',
        deliveryAddress: { street: '123 St', city: 'City' },
      });

    const orderId = createRes.body.data.orderId;

    // Customer cancels their own order
    const cancelRes = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ status: 'Cancelled', note: 'Customer changed their mind' });

    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.data.status).toBe('Cancelled');

    // Deleting a cancelled order is allowed
    const deleteRes = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${token1}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });
});
