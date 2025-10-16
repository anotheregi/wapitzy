const Joi = require("joi");
const { sendResponse } = require("../utils/response");
const httpStatusCode = require("../constants/httpStatusCode");
const logger = require("../utils/logger");

// In-memory storage for campaigns (in production, use database)
let campaigns = new Map();

module.exports = {
  async createCampaign(req, res) {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      sender: Joi.string().required(),
      message: Joi.string().required(),
      receivers: Joi.array().items(Joi.string()).min(1).required(),
      file: Joi.string(),
      viewOnce: Joi.boolean().default(false),
      delay: Joi.number().min(500).max(5000).default(1000),
      scheduled_at: Joi.date().iso().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return sendResponse(
        res,
        httpStatusCode.BAD_REQUEST,
        error.details[0].message
      );
    }

    const { name, description, sender, message, receivers, file, viewOnce, delay, scheduled_at } = req.body;
    const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const campaign = {
      id: campaignId,
      name,
      description: description || '',
      sender,
      message,
      file: file || null,
      viewOnce,
      delay,
      receivers,
      total_receivers: receivers.length,
      status: scheduled_at ? 'scheduled' : 'pending',
      scheduled_at: scheduled_at || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      results: null,
      progress: {
        sent: 0,
        failed: 0,
        invalid: 0,
        total: receivers.length
      }
    };

    campaigns.set(campaignId, campaign);

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
  },

  async getCampaigns(req, res) {
    const campaignList = Array.from(campaigns.values()).map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      sender: campaign.sender,
      status: campaign.status,
      total_receivers: campaign.total_receivers,
      progress: campaign.progress,
      scheduled_at: campaign.scheduled_at,
      created_at: campaign.created_at,
      updated_at: campaign.updated_at
    }));

    return sendResponse(
      res,
      httpStatusCode.OK,
      "Campaigns retrieved successfully",
      { campaigns: campaignList, total: campaignList.length }
    );
  },

  async getCampaign(req, res) {
    const { campaignId } = req.params;
    const campaign = campaigns.get(campaignId);

    if (!campaign) {
      return sendResponse(res, httpStatusCode.NOT_FOUND, "Campaign not found");
    }

    return sendResponse(
      res,
      httpStatusCode.OK,
      "Campaign retrieved successfully",
      campaign
    );
  },

  async updateCampaignStatus(req, res) {
    const schema = Joi.object({
      status: Joi.string().valid('pending', 'running', 'completed', 'failed', 'cancelled').required(),
      results: Joi.object().optional(),
      progress: Joi.object().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return sendResponse(
        res,
        httpStatusCode.BAD_REQUEST,
        error.details[0].message
      );
    }

    const { campaignId } = req.params;
    const campaign = campaigns.get(campaignId);

    if (!campaign) {
      return sendResponse(res, httpStatusCode.NOT_FOUND, "Campaign not found");
    }

    const { status, results, progress } = req.body;

    campaign.status = status;
    if (results) campaign.results = results;
    if (progress) campaign.progress = { ...campaign.progress, ...progress };
    campaign.updated_at = new Date().toISOString();

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
  },

  async deleteCampaign(req, res) {
    const { campaignId } = req.params;
    const campaign = campaigns.get(campaignId);

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

    campaigns.delete(campaignId);

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
  },

  async getCampaignStats(req, res) {
    const allCampaigns = Array.from(campaigns.values());

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
  }
};
