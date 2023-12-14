const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.resolve(__dirname, "../models/contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  const contacts = JSON.parse(data);
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find(({ id }) => id === contactId);
  if (!result) {
    return null;
  }
  return result;
};

const removeContact = async (contactId) => {
  const allContacts = await listContacts();
  const idx = allContacts.findIndex((item) => item.id === contactId);
  if (idx === -1) {
    return null;
  }
  const updatedContacts = allContacts.filter(({ id }) => id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
  return allContacts[idx];
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = {
    id: uuidv4(),
    ...body,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
