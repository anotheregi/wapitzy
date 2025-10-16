const { sendResponse } = require("../utils/response");
const httpStatusCode = require("../constants/httpStatusCode");
const logger = require("../utils/logger");
const { Campaign } = require("../models");

module.exports = {
  async createCampaign(req, res) {
    try {
      const { name, description, sender, message, receivers, file, viewOnce, delay, scheduled_at } = req.body;
      const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const campaign = await Campaign.create({
        id: campaignId,
        name,
        description: description || '',
        sender,
        message,
        file: file || null,
        viewOnce: viewOnce || false,
        delay: delay || 1000,
        receivers,
        total_receivers: receivers.length,
        status: scheduled_at ? 'scheduled' : 'pending',
        scheduled_at: scheduled_at || null,
        results: null,
        progress: {
          sent: 0,
          failed: 0,
          invalid: 0,
          total: receivers.length
        }
      });

      logger.info({
        msg: 'Campaign created',
        campaignId,
        name,
        sender,
        totalReceivers: receivers.length,
        status: campaign.status
      });

      return sendResponse(
        res,
        httpStatusCode.CREATED,
        "Campaign created successfully",
        campaign
      );
    } catch (error) {
      logger.error({
        msg: 'Error creating campaign',
        error: error.message,
        stack: error.stack
      });
      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to create campaign",
        null,
        error
      );
    }
  },

  async getCampaigns(req, res) {
    try {
      const campaigns = await Campaign.findAll({
        attributes: ['id', 'name', 'description', 'sender', 'status', 'total_receivers', 'progress', 'scheduled_at', 'created_at', 'updated_at'],
        order: [['created_at', 'DESC']]
      });

      return sendResponse(
        res,
        httpStatusCode.OK,
        "Campaigns retrieved successfully",
        { campaigns, total: campaigns.length }
      );
    } catch (error) {
      logger.error({
        msg: 'Error retrieving campaigns',
        error: error.message,
        stack: error.stack
      });
      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to retrieve campaigns",
        null,
        error
      );
    }
  },

  async getCampaign(req, res) {
    try {
      const { campaignId } = req.params;
      const campaign = await Campaign.findByPk(campaignId);

      if (!campaign) {
        return sendResponse(res, httpStatusCode.NOT_FOUND, "Campaign not found");
      }

      return sendResponse(
        res,
        httpStatusCode.OK,
        "Campaign retrieved successfully",
        campaign
      );
    } catch (error) {
      logger.error({
        msg: 'Error retrieving campaign',
        campaignId: req.params.campaignId,
        error: error.message,
        stack: error.stack
      });
      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to retrieve campaign",
        null,
        error
      );
    }
  },

  async updateCampaignStatus(req, res) {
    try {
      const { campaignId } = req.params;
      const { status, results, progress } = req.body;

      const campaign = await Campaign.findByPk(campaignId);
      if (!campaign) {
        return sendResponse(res, httpStatusCode.NOT_FOUND, "Campaign not found");
      }

      // Update fields
      campaign.status = status;
      if (results) campaign.results = results;
      if (progress) campaign.progress = { ...campaign.progress, ...progress };
      campaign.updated_at = new Date();

      await campaign.save();

      logger.info({
        msg: 'Campaign status updated',
        campaignId,
        name: campaign.name,
        status,
        progress: campaign.progress
      });

      return sendResponse(
        res,
        httpStatusCode.OK,
        "Campaign status updated successfully",
        campaign
      );
    } catch (error) {
      logger.error({
        msg: 'Error updating campaign status',
        campaignId: req.params.campaignId,
        error: error.message,
        stack: error.stack
      });
      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to update campaign status",
        null,
        error
      );
    }
  },

  async deleteCampaign(req, res) {
    try {
      const { campaignId } = req.params;
      const campaign = await Campaign.findByPk(campaignId);

      if (!campaign) {
        return sendResponse(res, httpStatusCode.NOT_FOUND, "Campaign not found");
      }

      if (campaign.status === 'running') {
        return sendResponse(
          res,
          httpStatusCode.BAD_REQUEST,
          "Cannot delete running campaign"
        );
      }

      await campaign.destroy();

      logger.info({
        msg: 'Campaign deleted',
        campaignId,
        name: campaign.name
      });

      return sendResponse(
        res,
        httpStatusCode.OK,
        "Campaign deleted successfully"
      );
    } catch (error) {
      logger.error({
        msg: 'Error deleting campaign',
        campaignId: req.params.campaignId,
        error: error.message,
        stack: error.stack
      });
      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to delete campaign",
        null,
        error
      );
    }
  },

  async getCampaignStats(req, res) {
    try {
      const allCampaigns = await Campaign.findAll();

      const stats = {
        total_campaigns: allCampaigns.length,
        status_breakdown: {
          pending: allCampaigns.filter(c => c.status === 'pending').length,
          running: allCampaigns.filter(c => c.status === 'running').length,
          completed: allCampaigns.filter(c => c.status === 'completed').length,
          failed: allCampaigns.filter(c => c.status === 'failed').length,
          cancelled: allCampaigns.filter(c => c.status === 'cancelled').length,
          scheduled: allCampaigns.filter(c => c.status === 'scheduled').length
        },
        total_messages_sent: allCampaigns
          .filter(c => c.results)
          .reduce((sum, c) => sum + (c.results.sent || 0), 0),
        total_messages_failed: allCampaigns
          .filter(c => c.results)
          .reduce((sum, c) => sum + (c.results.failed || 0), 0),
        average_success_rate: allCampaigns
          .filter(c => c.results && c.results.total > 0)
          .reduce((sum, c, _, arr) => {
            const rate = (c.results.sent / c.results.total) * 100;
            return sum + (rate / arr.length);
          }, 0).toFixed(2) + '%'
      };

      return sendResponse(
        res,
        httpStatusCode.OK,
        "Campaign statistics retrieved successfully",
        stats
      );
    } catch (error) {
      logger.error({
        msg: 'Error retrieving campaign stats',
        error: error.message,
        stack: error.stack
      });
      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to retrieve campaign statistics",
        null,
        error
      );
    }
  }
};
