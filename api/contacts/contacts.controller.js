const contacts = require("./contacts.js");
const Joi = require("joi");

class ContactControllers {
  async getContacts(req, res, next) {
    try {
      const getContact = await contacts.listContacts();
      return res.status(200).json(getContact);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const contactId = parseInt(req.params.contactId);
      // const findContact = contacts.find((contact) => contact.id === contactId);
      const findContact = await contacts.getContactById(contactId);
      if (findContact.length === 0) {
        return res.status(404).json({ message: "Not found" });
      }
      return res.status(200).send(findContact);
    } catch (err) {
      next(err);
    }
  }

  async createContact(req, res, next) {
    try {
      const { name, email, phone } = req.body;
      const newContact = { id: Date.now(), ...req.body };

      contacts.addContact(newContact);
      res.status(201).send(newContact);
    } catch (err) {
      next(err);
    }
  }

  async removeContact(req, res, next) {
    try {
      const contactId = parseInt(req.params.contactId);
      const findContact = await contacts.getContactById(contactId);
      if (findContact.length === 0) {
        return res.status(404).send({ message: "Not found" });
      } else {
        contacts.removeContact(contactId);
        return res.status(200).send({ message: "contact deleted" });
      }
    } catch (err) {
      next(err);
    }
  }

  async updateContact(req, res, next) {
    try {
      const contactId = parseInt(req.params.contactId);
      const findContact = await contacts.getContactById(contactId);
      if (findContact.length === 0) {
        return res.status(404).send({ message: "Not found" });
      } else {
        findContact[0] = { ...findContact[0], ...req.body };
        const getContact = await contacts.listContacts();

        return res.status(200).send(getContact);
      }
    } catch (err) {
      next(err);
    }
  }

  validateUpdateContact(req, res, next) {
    const updateContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.number(),
    });
    const result = Joi.validate(req.body, updateContactRules);
    if (result.error) {
      return res.status(400).send({ message: "missing fields" });
    }
    next();
  }
  validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.number().required(),
    });
    const result = Joi.validate(req.body, createContactRules);
    if (result.error) {
      return res.status(400).send({ message: "missing required name field" });
    }
    next();
  }
}

module.exports = new ContactControllers();
