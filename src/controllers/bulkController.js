const Joi = require("joi");
const whatsappService = require("../services/whatsappService");
const { categorizeFile } = require("../utils/general");
const { sendResponse } = require("../utils/response");
const httpStatusCode = require("../constants/httpStatusCode");
const logger = require("../utils/logger");

const checkFormatMedia = async (file, message, viewOnce) => {
  try {
    if (!file) {
      return null;
    }

    // Validasi URL terlebih dahulu
    const fileResponse = await fetch(file, { method: "HEAD" });
    if (!fileResponse.ok) {
      console.error("Invalid file URL:", file);
      return null;
    }

    // Kategorisasi file
    const categoryFile = categorizeFile(fileResponse);
    if (!categoryFile) {
      console.error("Failed to categorize file:", file);
      return null;
    }

    return {
      ...categoryFile,
      caption: message,
      viewOnce: viewOnce || false,
    };
  } catch (error) {
    console.error("Error checking media format:", error);
    return null;
  }
};

module.exports = {
  async sendBulkMessage(req, res) {
    const schema = Joi.object({
      sender: Joi.string().required(),
      receivers: Joi.array().items(Joi.string()).min(1).required(),
      message: Joi.string().required(),
      file: Joi.string(),
      viewOnce: Joi.boolean().default(false),
      delay: Joi.number().min(500).max(5000).default(1000), // delay between messages in ms
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return sendResponse(
        res,
        httpStatusCode.BAD_REQUEST,
        error.details[0].message
      );
    }

    const { sender, receivers, message, file, viewOnce, delay } = req.body;

    try {
      const client = whatsappService.getSession(sender);
      if (!client) {
        return sendResponse(res, httpStatusCode.NOT_FOUND, "Session not found");
      }

      // Format pesan dasar
      let formattedMessage = { text: message };

      // Cek dan format media jika ada
      if (file && file !== "") {
        const formattedMedia = await checkFormatMedia(file, message, viewOnce);
        if (!formattedMedia) {
          return sendResponse(
            res,
            httpStatusCode.BAD_REQUEST,
            "Invalid media file or URL"
          );
        }
        formattedMessage = formattedMedia;
      }

      // Format dan validasi penerima
      const formattedReceivers = receivers
        .map(receiver => receiver.trim())
        .filter(Boolean)
        .map(whatsappService.formatPhone);

      if (formattedReceivers.length === 0) {
        return sendResponse(
          res,
          httpStatusCode.BAD_REQUEST,
          "No valid receivers provided"
        );
      }

      logger.info({
        msg: `[BULK][${sender}] Starting bulk message to ${formattedReceivers.length} receivers`,
        sender,
        totalReceivers: formattedReceivers.length,
        delay
      });

      const results = [];
      const invalidNumbers = [];
      let sentCount = 0;
      let failedCount = 0;

      // Process receivers sequentially with delay
      for (const receiver of formattedReceivers) {
        try {
          // Check if number exists
          if (!whatsappService.isExists(client, receiver)) {
            invalidNumbers.push(receiver);
            failedCount++;
            results.push({
              receiver,
              status: "invalid",
              error: "Number not found on WhatsApp"
            });
            continue;
          }

          // Send message
          const sendResult = await whatsappService.sendMessage(
            client,
            receiver,
            formattedMessage
          );

          sentCount++;
          results.push({
            receiver,
            messageId: sendResult?.key?.id || null,
            status: "sent",
            timestamp: new Date().toISOString()
          });

          logger.info({
            msg: `[BULK][${sender}] Message sent to ${receiver}`,
            sender,
            receiver,
            messageId: sendResult?.key?.id,
            progress: `${sentCount}/${formattedReceivers.length}`
          });

        } catch (error) {
          failedCount++;
          results.push({
            receiver,
            status: "failed",
            error: error.message,
            timestamp: new Date().toISOString()
          });

          logger.error({
            msg: `[BULK][${sender}] Failed to send to ${receiver}`,
            sender,
            receiver,
            error: error.message
          });
        }

        // Delay between messages (except for last one)
        if (receiver !== formattedReceivers[formattedReceivers.length - 1]) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      const summary = {
        total: formattedReceivers.length,
        sent: sentCount,
        failed: failedCount,
        invalid: invalidNumbers.length,
        success_rate: ((sentCount / formattedReceivers.length) * 100).toFixed(2) + '%',
        campaign_id: `bulk_${Date.now()}_${sender}`,
        details: results
      };

      logger.info({
        msg: `[BULK][${sender}] Bulk messaging completed`,
        sender,
        summary
      });

      return sendResponse(
        res,
        httpStatusCode.OK,
        "Bulk message campaign completed",
        summary
      );

    } catch (error) {
      logger.error({
        msg: `[BULK][${sender}] Controller Error`,
        sender,
        error: error.message,
        stack: error.stack
      });

      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to send bulk messages",
        null,
        error
      );
    }
  }
};
