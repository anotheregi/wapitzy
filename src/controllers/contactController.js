const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { sendResponse } = require("../utils/response");
const httpStatusCode = require("../constants/httpStatusCode");
const logger = require("../utils/logger");

// In-memory storage for contact lists (in production, use database)
let contactLists = new Map();

module.exports = {
  async createContactList(req, res) {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      contacts: Joi.array().items(Joi.object({
        name: Joi.string(),
        phone: Joi.string().required(),
        tags: Joi.array().items(Joi.string())
      }))
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return sendResponse(
        res,
        httpStatusCode.BAD_REQUEST,
        error.details[0].message
      );
    }

    const { name, description, contacts } = req.body;
    const listId = `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const contactList = {
      id: listId,
      name,
      description: description || '',
      contacts: contacts || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_contacts: contacts ? contacts.length : 0
    };

    contactLists.set(listId, contactList);

    logger.info({
      msg: 'Contact list created',
      listId,
      name,
      totalContacts: contactList.total_contacts
    });

    return sendResponse(
      res,
      httpStatusCode.CREATED,
      "Contact list created successfully",
      contactList
    );
  },

  async getContactLists(req, res) {
    const lists = Array.from(contactLists.values()).map(list => ({
      id: list.id,
      name: list.name,
      description: list.description,
      total_contacts: list.total_contacts,
      created_at: list.created_at,
      updated_at: list.updated_at
    }));

    return sendResponse(
      res,
      httpStatusCode.OK,
      "Contact lists retrieved successfully",
      { lists, total: lists.length }
    );
  },

  async getContactList(req, res) {
    const { listId } = req.params;
    const list = contactLists.get(listId);

    if (!list) {
      return sendResponse(res, httpStatusCode.NOT_FOUND, "Contact list not found");
    }

    return sendResponse(
      res,
      httpStatusCode.OK,
      "Contact list retrieved successfully",
      list
    );
  },

  async updateContactList(req, res) {
    const schema = Joi.object({
      name: Joi.string(),
      description: Joi.string(),
      contacts: Joi.array().items(Joi.object({
        name: Joi.string(),
        phone: Joi.string().required(),
        tags: Joi.array().items(Joi.string())
      }))
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return sendResponse(
        res,
        httpStatusCode.BAD_REQUEST,
        error.details[0].message
      );
    }

    const { listId } = req.params;
    const list = contactLists.get(listId);

    if (!list) {
      return sendResponse(res, httpStatusCode.NOT_FOUND, "Contact list not found");
    }

    const { name, description, contacts } = req.body;

    if (name) list.name = name;
    if (description !== undefined) list.description = description;
    if (contacts) {
      list.contacts = contacts;
      list.total_contacts = contacts.length;
    }

    list.updated_at = new Date().toISOString();

    logger.info({
      msg: 'Contact list updated',
      listId,
      name: list.name,
      totalContacts: list.total_contacts
    });

    return sendResponse(
      res,
      httpStatusCode.OK,
      "Contact list updated successfully",
      list
    );
  },

  async deleteContactList(req, res) {
    const { listId } = req.params;
    const list = contactLists.get(listId);

    if (!list) {
      return sendResponse(res, httpStatusCode.NOT_FOUND, "Contact list not found");
    }

    contactLists.delete(listId);

    logger.info({
      msg: 'Contact list deleted',
      listId,
      name: list.name
    });

    return sendResponse(
      res,
      httpStatusCode.OK,
      "Contact list deleted successfully"
    );
  },

  async importContactsFromCSV(req, res) {
    const schema = Joi.object({
      listName: Joi.string().required(),
      description: Joi.string(),
      csvUrl: Joi.string().uri().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return sendResponse(
        res,
        httpStatusCode.BAD_REQUEST,
        error.details[0].message
      );
    }

    const { listName, description, csvUrl } = req.body;

    try {
      // Download CSV file
      const response = await fetch(csvUrl);
      if (!response.ok) {
        return sendResponse(
          res,
          httpStatusCode.BAD_REQUEST,
          "Failed to download CSV file"
        );
      }

      const csvText = await response.text();
      const contacts = [];

      // Parse CSV (assuming format: name,phone,tags)
      const lines = csvText.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= 2) {
          const contact = {
            name: values[0] || '',
            phone: values[1],
            tags: values[2] ? values[2].split(';').map(tag => tag.trim()) : []
          };
          contacts.push(contact);
        }
      }

      // Create contact list
      const listId = `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const contactList = {
        id: listId,
        name: listName,
        description: description || '',
        contacts,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_contacts: contacts.length
      };

      contactLists.set(listId, contactList);

      logger.info({
        msg: 'Contacts imported from CSV',
        listId,
        name: listName,
        totalContacts: contacts.length
      });

      return sendResponse(
        res,
        httpStatusCode.CREATED,
        "Contacts imported successfully from CSV",
        contactList
      );

    } catch (error) {
      logger.error({
        msg: 'Error importing contacts from CSV',
        error: error.message,
        stack: error.stack
      });

      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to import contacts from CSV",
        null,
        error
      );
    }
  },

  async getContactPhones(req, res) {
    const { listId } = req.params;
    const list = contactLists.get(listId);

    if (!list) {
      return sendResponse(res, httpStatusCode.NOT_FOUND, "Contact list not found");
    }

    const phones = list.contacts.map(contact => contact.phone);

    return sendResponse(
      res,
      httpStatusCode.OK,
      "Contact phones retrieved successfully",
      {
        list_id: listId,
        list_name: list.name,
        phones,
        total: phones.length
      }
    );
  }
};
