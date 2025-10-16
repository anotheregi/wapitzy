const { sendResponse } = require("../utils/response");
const httpStatusCode = require("../constants/httpStatusCode");
const logger = require("../utils/logger");
const { ContactList } = require("../models");

module.exports = {
  async createContactList(req, res) {
    try {
      const { name, description, contacts } = req.body;
      const listId = `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const contactList = await ContactList.create({
        id: listId,
        name,
        description: description || '',
        contacts: contacts || [],
        total_contacts: contacts ? contacts.length : 0
      });

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
    } catch (error) {
      logger.error({
        msg: 'Error creating contact list',
        error: error.message,
        stack: error.stack
      });
      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to create contact list",
        null,
        error
      );
    }
  },

  async getContactLists(req, res) {
    try {
      const lists = await ContactList.findAll({
        attributes: ['id', 'name', 'description', 'total_contacts', 'created_at', 'updated_at'],
        order: [['created_at', 'DESC']]
      });

      return sendResponse(
        res,
        httpStatusCode.OK,
        "Contact lists retrieved successfully",
        { lists, total: lists.length }
      );
    } catch (error) {
      logger.error({
        msg: 'Error retrieving contact lists',
        error: error.message,
        stack: error.stack
      });
      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to retrieve contact lists",
        null,
        error
      );
    }
  },

  async getContactList(req, res) {
    try {
      const { listId } = req.params;
      const list = await ContactList.findByPk(listId);

      if (!list) {
        return sendResponse(res, httpStatusCode.NOT_FOUND, "Contact list not found");
      }

      return sendResponse(
        res,
        httpStatusCode.OK,
        "Contact list retrieved successfully",
        list
      );
    } catch (error) {
      logger.error({
        msg: 'Error retrieving contact list',
        listId: req.params.listId,
        error: error.message,
        stack: error.stack
      });
      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to retrieve contact list",
        null,
        error
      );
    }
  },

  async updateContactList(req, res) {
    try {
      const { listId } = req.params;
      const { name, description, contacts } = req.body;

      const list = await ContactList.findByPk(listId);
      if (!list) {
        return sendResponse(res, httpStatusCode.NOT_FOUND, "Contact list not found");
      }

      // Update fields
      if (name !== undefined) list.name = name;
      if (description !== undefined) list.description = description;
      if (contacts !== undefined) {
        list.contacts = contacts;
        list.total_contacts = contacts.length;
      }
      list.updated_at = new Date();

      await list.save();

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
    } catch (error) {
      logger.error({
        msg: 'Error updating contact list',
        listId: req.params.listId,
        error: error.message,
        stack: error.stack
      });
      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to update contact list",
        null,
        error
      );
    }
  },

  async deleteContactList(req, res) {
    try {
      const { listId } = req.params;
      const list = await ContactList.findByPk(listId);

      if (!list) {
        return sendResponse(res, httpStatusCode.NOT_FOUND, "Contact list not found");
      }

      await list.destroy();

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
    } catch (error) {
      logger.error({
        msg: 'Error deleting contact list',
        listId: req.params.listId,
        error: error.message,
        stack: error.stack
      });
      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to delete contact list",
        null,
        error
      );
    }
  },

  async importContactsFromCSV(req, res) {
    try {
      const { listName, description, csvUrl } = req.body;

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
      const contactList = await ContactList.create({
        id: listId,
        name: listName,
        description: description || '',
        contacts,
        total_contacts: contacts.length
      });

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
    try {
      const { listId } = req.params;
      const list = await ContactList.findByPk(listId);

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
    } catch (error) {
      logger.error({
        msg: 'Error retrieving contact phones',
        listId: req.params.listId,
        error: error.message,
        stack: error.stack
      });
      return sendResponse(
        res,
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to retrieve contact phones",
        null,
        error
      );
    }
  }
};
