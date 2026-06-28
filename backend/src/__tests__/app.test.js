const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('should return 200 and the welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('QCTO LMIS Enterprise API running');
  });
});

describe('GET /api/dashboard', () => {
  it('should return dashboard data', async () => {
    const response = await request(app).get('/api/dashboard');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('learners');
    expect(response.body).toHaveProperty('courses');
    expect(response.body).toHaveProperty('modules');
    expect(Array.isArray(response.body.modules)).toBe(true);
  });
});

describe('GET /api/rest-api/modules', () => {
  it('should expose the registered backend module routes', async () => {
    const response = await request(app).get('/api/rest-api/modules');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'authentication', basePath: '/api/auth' }),
        expect.objectContaining({ id: 'programme-management', basePath: '/api/programmes' })
      ])
    );
  });
});

describe('GET role portal endpoints', () => {
  it('should return learner portal data', async () => {
    const response = await request(app).get('/api/learner-management/portal/learner');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('learner');
    expect(response.body).toHaveProperty('progress');
  });

  it('should return facilitator portal data', async () => {
    const response = await request(app).get('/api/lms/portal/facilitator');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('facilitator');
    expect(response.body).toHaveProperty('sessions');
  });

  it('should return parent portal data', async () => {
    const response = await request(app).get('/api/notifications/portal/parent');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('learner');
    expect(response.body).toHaveProperty('alerts');
  });
});

describe('Authentication', () => {
  it('should return the authenticated user session for a known role account', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'learner@mokhitli.com', password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toEqual(
      expect.objectContaining({ role: 'learner', defaultPortal: 'learner' })
    );
  });

  it('should return the authenticated profile via /api/auth/me', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'facilitator@mokhitli.com', password: 'password123' });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({ role: 'facilitator', defaultPortal: 'facilitator' })
    );
  });
});

describe('Expanded module endpoints', () => {
  it('should return user management data', async () => {
    const response = await request(app).get('/api/user-management/users');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('email');
  });

  it('should return reporting summary data', async () => {
    const response = await request(app).get('/api/reporting/summary');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('completionRate');
    expect(response.body).toHaveProperty('monthlyTrend');
  });

  it('should return AI insight data', async () => {
    const response = await request(app).get('/api/ai/insights');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('recommendations');
    expect(response.body).toHaveProperty('riskIndicators');
  });
});
