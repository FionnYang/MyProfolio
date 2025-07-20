import express from 'express'
import projectCtrl from '../controllers/project.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/')
  .get(projectCtrl.list)
  .post(authCtrl.requireSignin, projectCtrl.create)
  .delete(projectCtrl.removeAll)

router.route('/user')
  .get(authCtrl.requireSignin, projectCtrl.listByUser)

router.route('/:projectId')
  .get(projectCtrl.read)
  .put(projectCtrl.update)
  .delete(projectCtrl.remove)

router.param('projectId', projectCtrl.projectByID)

export default router