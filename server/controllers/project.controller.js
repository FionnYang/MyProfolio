import Project from '../models/project.model.js'
import extend from 'lodash/extend.js'
import errorHandler from './error.controller.js'

const create = async (req, res) => {
  const project = new Project(req.body)
  project.user = req.auth._id
  try {
    await project.save()
    res.status(200).json({ message: "Project created" })
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const list = async (req, res) => {
  try {
    const projects = await Project.find().populate('user', 'name email')
    res.json(projects)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const listByUser = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.auth._id }).populate('user', 'name email')
    res.json(projects)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const projectByID = async (req, res, next, id) => {
  try {
    const project = await Project.findById(id)
    if (!project) return res.status(400).json({ error: "Project not found" })
    req.profile = project
    next()
  } catch (err) {
    res.status(400).json({ error: "Could not retrieve project" })
  }
}

const read = (req, res) => {
  res.json(req.profile)
}

const update = async (req, res) => {
  try {
    let project = req.profile
    project = extend(project, req.body)
    await project.save()
    res.json(project)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const remove = async (req, res) => {
  try {
    const deletedProject = await req.profile.deleteOne()
    res.json(deletedProject)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}
const removeAll = async (req, res) => {
  try {
    const result = await Project.deleteMany({})
    res.json({ message: `${result.deletedCount} projects deleted.` })
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { create, projectByID, read, list, listByUser, update, remove, removeAll }