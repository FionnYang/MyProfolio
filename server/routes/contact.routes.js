import express from 'express'
import contactCtrl from '../controllers/contact.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/')
  .get(contactCtrl.list)
  .post(authCtrl.requireSignin, contactCtrl.create)
  .delete(contactCtrl.removeAll)

router.route('/user')
  .get(authCtrl.requireSignin, contactCtrl.listByUser)

router.route('/:contactId')
  .get(contactCtrl.read)
  .put(contactCtrl.update)
  .delete(contactCtrl.remove)

router.param('contactId', contactCtrl.contactByID)

export default router