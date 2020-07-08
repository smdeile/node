const fs = require("fs");
const { promises: fsPromises } = fs;
const path = require("path");

const contactsPath = path.join(__dirname, "../../db/contacts.json");

async function listContacts() {
  try {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    return contacts.filter((contact) => contact.id === contactId);
  } catch (err) {
    console.log(err);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const withoutDelContact = contacts.filter(
      (contact) => contact.id !== contactId
    );
    console.table(withoutDelContact);
    await fsPromises.writeFile(contactsPath, JSON.stringify(withoutDelContact));
  } catch (err) {
    console.log(err);
  }
}

async function addContact({ name, email, phone, id }) {
  try {
    const contacts = await listContacts();

    const newContact = {
      id: id,
      name: name,
      email: email,
      phone: phone,
    };
    contacts.push(newContact);
    await fsPromises.writeFile(contactsPath, JSON.stringify(contacts));
  } catch (err) {
    console.log(err);
  }
}

async function updateContact(reqBody, id) {
  try {
    const contacts = await listContacts();
    const findContact = await contacts.filter((contact) => contact.id === id);
    const withoutDelContact = contacts.filter((contact) => contact.id !== id);
    const updateContact = {
      ...findContact[0],
      ...reqBody,
    };
    withoutDelContact.push(updateContact);
    await fsPromises.writeFile(contactsPath, JSON.stringify(withoutDelContact));
    return withoutDelContact;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
