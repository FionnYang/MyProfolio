import express from 'express'
import educationCtrl from '../controllers/education.controller.js'

const router = express.Router()

router.route('/')
  .get(educationCtrl.list)
  .post(educationCtrl.create)
  .delete(educationCtrl.removeAll)

router.route('/:educationId')
  .get(educationCtrl.read)
  .put(educationCtrl.update)
  .delete(educationCtrl.remove)

router.param('educationId', educationCtrl.educationByID)

export default router