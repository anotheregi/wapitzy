const request = require('supertest');
const { sequelize, Campaign, ContactList } = require('../src/models');
const app = require('../app');

describe('Integration Tests', () => {
  beforeAll(async () => {
    // Sync database for testing
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close database connection
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clear all tables before each test
    await Campaign.destroy({ where: {} });
    await ContactList.destroy({ where: {} });
  });

  describe('Campaign and Contact List Integration', () => {
    it('should create contact list and use it in campaign', async () => {
      // Create a contact list
      const contactData = {
        name: 'Integration Test List',
        description: 'List for integration testing',
        contacts: [
          { name: 'Alice', phone: '1111111111', tags: ['test'] },
          { name: 'Bob', phone: '2222222222', tags: ['test'] }
        ]
      };

      const contactResponse = await request(app)
        .post('/contacts')
        .send(contactData)
        .expect(201);

      const listId = contactResponse.body.data.id;

      // Get phones from the list
      const phonesResponse = await request(app)
        .get(`/contacts/${listId}/phones`)
        .expect(200);

      const phones = phonesResponse.body.data.phones;

      // Create a campaign using the phones
      const campaignData = {
        name: 'Integration Campaign',
        description: 'Campaign using contact list',
        sender: '3333333333',
        message: 'Integration test message',
        receivers: phones
      };

      const campaignResponse = await request(app)
        .post('/campaigns')
        .send(campaignData)
        .expect(201);

      expect(campaignResponse.body.success).toBe(true);
      expect(campaignResponse.body.data.total_receivers).toBe(2);
      expect(campaignResponse.body.data.receivers).toEqual(phones);
    });

    it('should handle campaign status updates and statistics', async () => {
      // Create a campaign
      const campaignData = {
        name: 'Status Test Campaign',
        sender: '1234567890',
        message: 'Status test',
        receivers: ['0987654321']
      };

      const createResponse = await request(app)
        .post('/campaigns')
        .send(campaignData)
        .expect(201);

      const campaignId = createResponse.body.data.id;

      // Update campaign status
      const updateData = {
        status: 'completed',
        results: { sent: 1, failed: 0, total: 1 },
        progress: { sent: 1, failed: 0, invalid: 0, total: 1 }
      };

      await request(app)
        .put(`/campaigns/${campaignId}/status`)
        .send(updateData)
        .expect(200);

      // Check statistics
      const statsResponse = await request(app)
        .get('/campaigns/stats')
        .expect(200);

      expect(statsResponse.body.success).toBe(true);
      expect(statsResponse.body.data.total_campaigns).toBe(1);
      expect(statsResponse.body.data.status_breakdown.completed).toBe(1);
      expect(statsResponse.body.data.total_messages_sent).toBe(1);
    });

    it('should handle multiple campaigns and contact lists', async () => {
      // Create multiple contact lists
      const list1 = await ContactList.create({
        id: 'int_list1',
        name: 'List 1',
        contacts: [{ name: 'User1', phone: '111' }],
        total_contacts: 1
      });

      const list2 = await ContactList.create({
        id: 'int_list2',
        name: 'List 2',
        contacts: [{ name: 'User2', phone: '222' }],
        total_contacts: 1
      });

      // Create multiple campaigns
      await Campaign.create({
        id: 'int_camp1',
        name: 'Campaign 1',
        sender: '333',
        message: 'Msg 1',
        receivers: ['111'],
        total_receivers: 1,
        status: 'completed',
        results: { sent: 1, failed: 0, total: 1 }
      });

      await Campaign.create({
        id: 'int_camp2',
        name: 'Campaign 2',
        sender: '444',
        message: 'Msg 2',
        receivers: ['222'],
        total_receivers: 1,
        status: 'pending'
      });

      // Test retrieval of all lists
      const listsResponse = await request(app)
        .get('/contacts')
        .expect(200);

      expect(listsResponse.body.data.lists.length).toBe(2);

      // Test retrieval of all campaigns
      const campaignsResponse = await request(app)
        .get('/campaigns')
        .expect(200);

      expect(campaignsResponse.body.data.campaigns.length).toBe(2);

      // Test statistics
      const statsResponse = await request(app)
        .get('/campaigns/stats')
        .expect(200);

      expect(statsResponse.body.data.total_campaigns).toBe(2);
      expect(statsResponse.body.data.status_breakdown.completed).toBe(1);
      expect(statsResponse.body.data.status_breakdown.pending).toBe(1);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle database errors gracefully', async () => {
      // Force a database error by using invalid data
      const invalidCampaign = {
        name: null, // Invalid name
        sender: '123',
        message: 'test',
        receivers: []
      };

      const response = await request(app)
        .post('/campaigns')
        .send(invalidCampaign)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Failed to create campaign');
    });

    it('should handle not found errors', async () => {
      const response = await request(app)
        .get('/campaigns/nonexistent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Campaign not found');
    });
  });
});
