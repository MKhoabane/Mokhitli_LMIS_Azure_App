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
      .send({ email: 'learner@mokhitli.com', password: 'Learner@Mokhitli2026' });

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
      .send({ email: 'facilitator@mokhitli.com', password: 'Facilitator@Mokhitli2026' });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({ role: 'facilitator', defaultPortal: 'facilitator' })
    );
  });

  it('should register a new account and return an authenticated session', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Lebo Molefe',
        email: 'lebo.molefe@example.com',
        password: 'password123',
        role: 'learner'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toEqual(
      expect.objectContaining({
        name: 'Lebo Molefe',
        email: 'lebo.molefe@example.com',
        role: 'learner',
        defaultPortal: 'learner'
      })
    );
  });

  it('should reject registration when the email already exists', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate User',
        email: 'learner@mokhitli.com',
        password: 'password123',
        role: 'learner'
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.error).toContain('already exists');
  });

  it('should reject weak passwords during user registration', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Weak Password User',
        email: 'weak.password.user@example.com',
        password: 'password',
        role: 'learner'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('at least 8 characters');
  });

  it('should register a company and its primary employer user', async () => {
    const response = await request(app)
      .post('/api/auth/register-company')
      .send({
        companyName: 'Blue Crane Logistics',
        companyEmail: 'contact@bluecrane.example.com',
        adminName: 'Kabelo Ndlovu',
        adminEmail: 'kabelo.ndlovu@bluecrane.example.com',
        password: 'password123',
        industry: 'Logistics',
        requestedUsers: 24,
        invitedUsers: [
          {
            name: 'Lerato Mokoena',
            email: 'lerato.mokoena@bluecrane.example.com',
            role: 'learner'
          },
          {
            name: 'Sipho Dlamini',
            email: 'sipho.dlamini@bluecrane.example.com',
            role: 'facilitator'
          }
        ]
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('company');
    expect(response.body.user).toEqual(
      expect.objectContaining({
        name: 'Kabelo Ndlovu',
        email: 'kabelo.ndlovu@bluecrane.example.com',
        role: 'employer',
        defaultPortal: 'employer'
      })
    );
    expect(response.body.company).toEqual(
      expect.objectContaining({
        name: 'Blue Crane Logistics',
        companyEmail: 'contact@bluecrane.example.com',
        requestedUsers: 24
      })
    );
    expect(response.body.company.invitations).toHaveLength(2);
    expect(response.body.company.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: 'kabelo.ndlovu@bluecrane.example.com', status: 'Active' }),
        expect.objectContaining({ email: 'lerato.mokoena@bluecrane.example.com', status: 'Invited' })
      ])
    );
  });

  it('should reject duplicate company registration', async () => {
    const response = await request(app)
      .post('/api/auth/register-company')
      .send({
        companyName: 'Mokhitli Logistics Partners',
        companyEmail: 'partners@mokhitli.com',
        adminName: 'Existing Admin',
        adminEmail: 'new-admin@mokhitli.com',
        password: 'password123',
        industry: 'Logistics',
        requestedUsers: 12
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.error).toContain('already registered');
  });

  it('should reject weak passwords during company registration', async () => {
    const response = await request(app)
      .post('/api/auth/register-company')
      .send({
        companyName: 'Weak Password Logistics',
        companyEmail: 'weak-password-logistics@example.com',
        adminName: 'Weak Admin',
        adminEmail: 'weak-admin@example.com',
        password: 'password',
        industry: 'Logistics',
        requestedUsers: 6
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('at least 8 characters');
  });

  it('should expose company management data for an authenticated employer', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'employer@mokhitli.com', password: 'Employer@Mokhitli2026' });

    const response = await request(app)
      .get('/api/workplace-learning/company-management')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.company).toEqual(
      expect.objectContaining({ name: 'Mokhitli Logistics Partners' })
    );
    expect(response.body.isCompanyAdmin).toBe(true);
    expect(Array.isArray(response.body.users)).toBe(true);
    expect(Array.isArray(response.body.invitations)).toBe(true);
  });

  it('should allow an authenticated employer to invite more company users', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'employer@mokhitli.com', password: 'Employer@Mokhitli2026' });

    const response = await request(app)
      .post('/api/workplace-learning/company-management/users/invite')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({
        invitedUsers: [
          {
            name: 'Ayanda Nkosi',
            email: 'ayanda.nkosi@mokhitli.com',
            role: 'assessor'
          }
        ]
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.invitations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          recipientEmail: 'ayanda.nkosi@mokhitli.com',
          role: 'assessor',
          status: 'sent'
        })
      ])
    );
  });

  it('should expose invitation details through the public invitation endpoint', async () => {
    const response = await request(app).get('/api/auth/invitations/INV-001');

    expect(response.statusCode).toBe(200);
    expect(response.body.invitation).toEqual(
      expect.objectContaining({
        id: 'INV-001',
        recipientEmail: 'nomsa@mokhitli.com'
      })
    );
    expect(response.body.company).toEqual(
      expect.objectContaining({ name: 'Mokhitli Logistics Partners' })
    );
  });

  it('should accept an invitation and return an authenticated session', async () => {
    const registrationResponse = await request(app)
      .post('/api/auth/register-company')
      .send({
        companyName: 'Forward Freight',
        companyEmail: 'hello@forwardfreight.example.com',
        adminName: 'Mpho Maseko',
        adminEmail: 'mpho@forwardfreight.example.com',
        password: 'password123',
        industry: 'Freight',
        requestedUsers: 8,
        invitedUsers: [
          {
            name: 'Tumi Nene',
            email: 'tumi@forwardfreight.example.com',
            role: 'learner'
          }
        ]
      });

    const invitationId = registrationResponse.body.company.invitations[0].id;

    const response = await request(app)
      .post(`/api/auth/invitations/${invitationId}/accept`)
      .send({ password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: 'tumi@forwardfreight.example.com',
        role: 'learner',
        companyName: 'Forward Freight'
      })
    );
    expect(response.body.invitation.status).toBe('accepted');
  });

  it('should reject weak passwords when accepting an invitation', async () => {
    const registrationResponse = await request(app)
      .post('/api/auth/register-company')
      .send({
        companyName: 'Invitation Password Guard',
        companyEmail: 'invitation-password-guard@example.com',
        adminName: 'Secure Admin',
        adminEmail: 'secure-admin@example.com',
        password: 'Strong@Pass123',
        industry: 'Logistics',
        requestedUsers: 3,
        invitedUsers: [
          {
            name: 'Weak Invitee',
            email: 'weak-invitee@example.com',
            role: 'learner'
          }
        ]
      });

    const invitationId = registrationResponse.body.company.invitations[0].id;

    const response = await request(app)
      .post(`/api/auth/invitations/${invitationId}/accept`)
      .send({ password: 'password' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('at least 8 characters');
  });

  it('should resend and cancel an invitation from company management', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'employer@mokhitli.com', password: 'Employer@Mokhitli2026' });

    const resendResponse = await request(app)
      .post('/api/workplace-learning/company-management/invitations/INV-001/resend')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(resendResponse.statusCode).toBe(200);
    expect(resendResponse.body.invitation).toEqual(
      expect.objectContaining({
        id: 'INV-001',
        status: 'sent'
      })
    );

    const cancelResponse = await request(app)
      .post('/api/workplace-learning/company-management/invitations/INV-001/cancel')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(cancelResponse.statusCode).toBe(200);
    expect(cancelResponse.body.invitation).toEqual(
      expect.objectContaining({
        id: 'INV-001',
        status: 'cancelled'
      })
    );
  });

  it('should block non-admin company members from managing invitations', async () => {
    const registrationResponse = await request(app)
      .post('/api/auth/register-company')
      .send({
        companyName: 'Admin Guard Logistics',
        companyEmail: 'contact@adminguard.example.com',
        adminName: 'Nandi Khumalo',
        adminEmail: 'nandi@adminguard.example.com',
        password: 'password123',
        industry: 'Logistics',
        requestedUsers: 5,
        invitedUsers: [
          {
            name: 'Chris Motaung',
            email: 'chris@adminguard.example.com',
            role: 'facilitator'
          }
        ]
      });

    const invitationId = registrationResponse.body.company.invitations[0].id;

    const acceptanceResponse = await request(app)
      .post(`/api/auth/invitations/${invitationId}/accept`)
      .send({ password: 'password123' });

    const response = await request(app)
      .get('/api/workplace-learning/company-management')
      .set('Authorization', `Bearer ${acceptanceResponse.body.token}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.error).toContain('Only employer admins');
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
