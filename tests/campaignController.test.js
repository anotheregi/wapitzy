const request = require('supertest');
const { sequelize, Campaign } = require('../src/models');
const app = require('../app'); // Assuming app.js exports the Express app

describe('Campaign Controller', () => {
  beforeAll(async () => {
    // Sync database for testing
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close database connection
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clear campaigns table before each test
    await Campaign.destroy({ where: {} });
  });

  describe('POST /campaigns', () => {
    it('should create a new campaign', async () => {
      const campaignData = {
        name: 'Test Campaign',
        description: 'A test campaign',
        sender: '1234567890',
        message: 'Hello World',
        receivers: ['0987654321', '1122334455']
      };

      const response = await request(app)
        .post('/campaigns')
        .send(campaignData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(campaignData.name);
      expect(response.body.data.total_receivers).toBe(2);
      expect(response.body.data.status).toBe('pending');
    });

    it('should return error for invalid data', async () => {
      const invalidData = {
        name: '',
        sender: 'invalid',
        message: '',
        receivers: []
      };

      const response = await request(app)
        .post('/campaigns')
        .send(invalidData)
        .expect(500); // Assuming validation is handled

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /campaigns', () => {
    it('should retrieve all campaigns', async () => {
      // Create test campaigns
      await Campaign.create({
        id: 'test1',
        name: 'Campaign 1',
        sender: '123',
        message: 'Msg 1',
        receivers: ['456'],
        total_receivers: 1
      });

      await Campaign.create({
        id: 'test2',
        name: 'Campaign 2',
        sender: '789',
        message: 'Msg 2',
        receivers: ['012'],
        total_receivers: 1
      });

      const response = await request(app)
        .get('/campaigns')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campaigns.length).toBe(2);
      expect(response.body.data.total).toBe(2);
    });
  });

  describe('GET /campaigns/:campaignId', () => {
    it('should retrieve a specific campaign', async () => {
      const campaign = await Campaign.create({
        id: 'test123',
        name: 'Test Campaign',
        sender: '123',
        message: 'Test',
        receivers: ['456'],
        total_receivers: 1
      });

      const response = await request(app)
        .get(`/campaigns/${campaign.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(campaign.id);
    });

    it('should return 404 for non-existent campaign', async () => {
      const response = await request(app)
        .get('/campaigns/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /campaigns/:campaignId/status', () => {
    it('should update campaign status', async () => {
      const campaign = await Campaign.create({
        id: 'test456',
        name: 'Test Campaign',
        sender: '123',
        message: 'Test',
        receivers: ['456'],
        total_receivers: 1,
        status: 'pending'
      });

      const updateData = {
        status: 'running',
        progress: { sent: 1, failed: 0, invalid: 0, total: 1 }
      };

      const response = await request(app)
        .put(`/campaigns/${campaign.id}/status`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('running');
    });
  });

  describe('DELETE /campaigns/:campaignId', () => {
    it('should delete a campaign', async () => {
      const campaign = await Campaign.create({
        id: 'test789',
        name: 'Test Campaign',
        sender: '123',
        message: 'Test',
        receivers: ['456'],
        total_receivers: 1
      });

      const response = await request(app)
        .delete(`/campaigns/${campaign.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify deletion
      const deleted = await Campaign.findByPk(campaign.id);
      expect(deleted).toBeNull();
    });
  });

  describe('GET /campaigns/stats', () => {
    it('should retrieve campaign statistics', async () => {
      await Campaign.create({
        id: 'stat1',
        name: 'Completed Campaign',
        sender: '123',
        message: 'Test',
        receivers: ['456'],
        total_receivers: 1,
        status: 'completed',
        results: { sent: 1, failed: 0, total: 1 }
      });

      const response = await request(app)
        .get('/campaigns/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total_campaigns).toBe(1);
      expect(response.body.data.status_breakdown.completed).toBe(1);
    });
  });
});
