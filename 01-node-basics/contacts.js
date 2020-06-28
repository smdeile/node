const fs = require("fs");
const { promises: fsPromises } = fs;
const path = require("path");
// const uniqid = require("uniqid");

const contactsPath = path.join(__dirname, "./db/contacts.json");
/*  try {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }*/
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
    contacts.filter((contact) => contact.id === contactId);
    console.log(contacts.filter((contact) => contact.id === contactId));
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

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    console.log(contacts.length);
    const newContact = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
    };
    contacts.push(newContact);
    console.table(contacts);
    await fsPromises.writeFile(contactsPath, JSON.stringify(contacts));
  } catch (err) {
    console.log(err);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
