import express from 'express'
import userControl from './../controllers/user.controller'
import authControl from './../controllers/auth.controller'

const router = express.Router()

router.route('/api/users')
    .get(userControl.list)
    .post(userControl.create)

router.route('/api/users/photo/:userId')
    .get(userControl.photo, userControl.defaultPhoto)
router.route('/api/users/defaultphoto')
    .get(userControl.defaultPhoto)

router.route('/api/users/follow')
    .put(authControl.requireSignin, userControl.addFollowing, userControl.addFollower)
router.route('/api/users/unfollow')
    .put(authControl.requireSignin, userControl.removeFollowing, userControl.removeFollower)

router.route('/api/users/findpeople/:userId')
    .get(authControl.requireSignin, userControl.findPeople)

router.route('/api/users/:userId')
    .get(authControl.requireSignin, userControl.read)
    .put(authControl.requireSignin, authControl.hasAuthorization, userControl.update)
    .delete(authControl.requireSignin, authControl.hasAuthorization,userControl.remove)

router.param('userId', userControl.userByID)

export default router