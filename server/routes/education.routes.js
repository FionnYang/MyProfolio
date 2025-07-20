import express from 'express'
import educationCtrl from '../controllers/education.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/')
  .get(educationCtrl.list)
  .post(authCtrl.requireSignin, educationCtrl.create)
  .delete(educationCtrl.removeAll)

router.route('/user')
  .get(authCtrl.requireSignin, educationCtrl.listByUser)

router.route('/:educationId')
  .get(educationCtrl.read)
  .put(educationCtrl.update)
  .delete(educationCtrl.remove)

router.param('educationId', educationCtrl.educationByID)

export default router