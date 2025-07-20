import Contact from '../models/contact.model.js'
import extend from 'lodash/extend.js'
import errorHandler from './error.controller.js'

const create = async (req, res) => {
  const contact = new Contact(req.body)
  contact.user = req.auth._id
  try {
    await contact.save()
    res.status(200).json({ message: "Contact created" })
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const list = async (req, res) => {
  try {
    const contacts = await Contact.find().populate('user', 'name email')
    res.json(contacts)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const listByUser = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.auth._id }).populate('user', 'name email')
    res.json(contacts)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const contactByID = async (req, res, next, id) => {
  try {
    const contact = await Contact.findById(id)
    if (!contact) return res.status(400).json({ error: "Contact not found" })
    req.profile = contact
    next()
  } catch (err) {
    res.status(400).json({ error: "Could not retrieve contact" })
  }
}

const read = (req, res) => {
  res.json(req.profile)
}

const update = async (req, res) => {
  try {
    let contact = req.profile
    contact = extend(contact, req.body)
    await contact.save()
    res.json(contact)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const remove = async (req, res) => {
  try {
    const deletedContact = await req.profile.deleteOne()
    res.json(deletedContact)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const removeAll = async (req, res) => {
  try {
    const result = await Contact.deleteMany({})
    res.json({ message: `${result.deletedCount} contacts deleted.` })
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}
export default { create, contactByID, read, list, listByUser, update, remove, removeAll }