import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { signToken } from '../src/middleware/auth.js';

describe('User Profile & Address API (/api/users)', () => {
  let user, token;

  beforeEach(async () => {
    user = await User.create({
      phone: '+15557778888',
      name: 'Michael Scott',
      email: 'michael@dundermifflin.com',
      role: 'customer',
      addresses: [],
    });
    token = signToken({ id: user._id.toString(), phone: user.phone, role: 'customer' });
  });

  it('should retrieve authenticated user profile', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Michael Scott');
    expect(res.body.data.phone).toBe('+15557778888');
  });

  it('should update authenticated user profile details', async () => {
    const res = await request(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Michael Gary Scott',
        email: 'greatscottawards@gmail.com',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Michael Gary Scott');
    expect(res.body.data.email).toBe('greatscottawards@gmail.com');

    // Verify in database
    const updated = await User.findById(user._id);
    expect(updated.name).toBe('Michael Gary Scott');
  });

  it('should add, update, and delete user addresses', async () => {
    // 1. Add address
    const addRes = await request(app)
      .post('/api/users/me/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tag: 'Home',
        street: '1725 Slough Avenue',
        city: 'Scranton',
        pincode: '18503',
        landmark: 'Near Steamtown Mall',
        isDefault: true,
      });

    expect(addRes.status).toBe(201);
    expect(addRes.body.address.street).toBe('1725 Slough Avenue');
    expect(addRes.body.address.isDefault).toBe(true);

    const addressId = addRes.body.address._id;

    // 2. Update address
    const updateRes = await request(app)
      .patch(`/api/users/me/addresses/${addressId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: '1725 Slough Avenue, Suite 200',
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.address.street).toBe('1725 Slough Avenue, Suite 200');

    // 3. Delete address
    const deleteRes = await request(app)
      .delete(`/api/users/me/addresses/${addressId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.addresses).toHaveLength(0);
  });

  it('should reject unauthenticated access to user endpoints', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });
});
