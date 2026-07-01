const request = require('supertest');
const { app } = require('../server');

describe('session auth flow', () => {
  it('returns the authenticated user from /me after login', async () => {
    const agent = request.agent(app);

    const registerRes = await agent
      .post('/register')
      .send({
        fullName: 'Session Test User',
        email: 'session-test@example.com',
        studentID: 'SESSION123',
        password: 'Password123!'
      });

    expect(registerRes.status).toBe(201);

    const meRes = await agent.get('/me');
    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('session-test@example.com');
  });
});
