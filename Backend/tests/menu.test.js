import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { Menu } from '../src/models/Menu.js';
import { User } from '../src/models/User.js';
import { signToken } from '../src/middleware/auth.js';

describe('Menu Management API (/api/menu)', () => {
  let adminToken;
  let customerToken;
  let sampleItem;

  beforeEach(async () => {
    // Create admin user
    const adminUser = await User.create({
      phone: '+15550000001',
      name: 'Admin Boss',
      role: 'admin',
    });
    adminToken = signToken({ id: adminUser._id.toString(), phone: adminUser.phone, role: 'admin' });

    // Create normal customer
    const customerUser = await User.create({
      phone: '+15550000002',
      name: 'Jane Customer',
      role: 'customer',
    });
    customerToken = signToken({ id: customerUser._id.toString(), phone: customerUser.phone, role: 'customer' });

    // Insert sample dishes
    sampleItem = await Menu.create({
      itemId: 'b1',
      name: 'Smoky Angus Beast Burger',
      category: 'Burger',
      description: 'Juicy 100% Angus beef patty with cheddar',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-burger.jpg',
      isAvailable: true,
      options: [{ name: 'Extra Cheese', price: 1.5 }],
    });

    await Menu.create({
      itemId: 'p1',
      name: 'Artisan Burrata & Pepperoni Pizza',
      category: 'Pizza',
      description: 'Slow-fermented sourdough crust with burrata',
      price: 17.99,
      image: 'https://images.unsplash.com/photo-pizza.jpg',
      isAvailable: true,
    });

    await Menu.create({
      itemId: 'b2',
      name: 'Sold Out Burger',
      category: 'Burger',
      description: 'Not available currently',
      price: 10.0,
      image: 'https://images.unsplash.com/photo-burger2.jpg',
      isAvailable: false, // unavailable
    });
  });

  it('should retrieve available food items', async () => {
    const res = await request(app).get('/api/menu');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.menu).toHaveLength(2); // Only isAvailable: true
    expect(res.body.menu.some((i) => i.name === 'Sold Out Burger')).toBe(false);
  });

  it('should filter items by category', async () => {
    const res = await request(app).get('/api/menu?category=Pizza');

    expect(res.status).toBe(200);
    expect(res.body.menu).toHaveLength(1);
    expect(res.body.menu[0].category).toBe('Pizza');
  });

  it('should search food items by keyword', async () => {
    const res = await request(app).get('/api/menu?search=Angus');

    expect(res.status).toBe(200);
    expect(res.body.menu).toHaveLength(1);
    expect(res.body.menu[0].name).toContain('Angus');
  });

  it('should retrieve a specific food item by ID or custom itemId', async () => {
    // Custom ID: 'b1'
    const resByCustom = await request(app).get('/api/menu/b1');
    expect(resByCustom.status).toBe(200);
    expect(resByCustom.body.data.name).toBe('Smoky Angus Beast Burger');

    // MongoDB ObjectId
    const resByObjId = await request(app).get(`/api/menu/${sampleItem._id}`);
    expect(resByObjId.status).toBe(200);
    expect(resByObjId.body.data.name).toBe('Smoky Angus Beast Burger');
  });

  it('should return 404 for non-existent item IDs', async () => {
    const res = await request(app).get('/api/menu/non_existent_id_999');
    expect(res.status).toBe(404);
    expect(res.body.message).toContain('was not found');
  });

  it('should reject menu mutations from customers or unauthenticated users', async () => {
    // Unauthenticated
    const resUnauth = await request(app)
      .post('/api/menu')
      .send({ name: 'Hacker Food', price: 1 });
    expect(resUnauth.status).toBe(401);

    // Customer role (non-admin)
    const resCustomer = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Forbidden Dish',
        description: 'Should fail',
        price: 9.99,
        image: 'https://images.com/dish.jpg',
        category: 'Burger',
      });
    expect(resCustomer.status).toBe(403);
  });

  it('should allow admin to create and update menu items', async () => {
    // Create new item
    const createRes = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Chef Signature Truffle Roll',
        description: 'Gourmet handcrafted roll',
        price: 14.5,
        image: 'https://images.unsplash.com/roll.jpg',
        category: 'Rolls',
        isAvailable: true,
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.name).toBe('Chef Signature Truffle Roll');

    const createdId = createRes.body.data._id;

    // Update item price
    const updateRes = await request(app)
      .patch(`/api/menu/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 16.0 });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.price).toBe(16.0);
  });
});
