import express from 'express'
import authControl from './../controllers/auth.controller'
import userControl from './../controllers/user.controller'
import postControl from './../controllers/post.controller'

const router = express.Router()

router.route('/api/posts/photo/:postId')
    .get(postControl.photo)

router.route('/api/posts/feed/:userId')
    .get(authControl.requireSignin, postControl.listNewsFeed)

router.route('/api/posts/by/:userId')
    .get(authControl.requireSignin, postControl.listByUser)

router.route('/api/posts/new/:userId')
    .post(authControl.requireSignin, postControl.create)

router.route('/api/posts/like')
    .put(authControl.requireSignin, postControl.like)

router.route('/api/posts/unlike')
    .put(authControl.requireSignin, postControl.unlike)

router.route('/api/posts/comment')
    .put(authControl.requireSignin, postControl.comment)

router.route('/api/posts/uncomment')
    .put(authControl.requireSignin, postControl.uncomment)

router.route('/api/posts/:postId')
    .delete(authControl.requireSignin, postControl.isPoster, postControl.remove)

router.param('userId', userControl.userByID)

router.param('postId', postControl.postById)

export default router