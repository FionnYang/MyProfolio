import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/')
  .post(userCtrl.create)
  .get(userCtrl.list)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, userCtrl.removeAll)

router.route('/current')
  .get(authCtrl.requireSignin, userCtrl.getCurrentUser)

router.route('/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorizationOrAdmin, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, userCtrl.remove)

router.route('/:userId/toggle-role')
  .put(authCtrl.requireSignin, authCtrl.canToggleRole, userCtrl.toggleRole)
  
router.param('userId', userCtrl.userByID)

export default router