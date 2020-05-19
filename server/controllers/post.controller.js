import postModel from './../models/post.model'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'

const create = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            res.status(400).json({error: 'Image could not be uploaded'})
        }
        let post = postModel(fields)
        post.postedBy = req.profile
        if(files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }
        post.save((err, result) => {
            if(err) {
                res.status(400).json({error: errorHandler.getErrorMessage(err)})
            }
            res.status(200).json(result)
        })
    })
}

const postById = (req, res, next, id) => {
    postModel.findById({_id: id})
        // .populate('comments', 'text created')
        .populate('postedBy', '_id name')
        .exec((err, post) => {
            if(err || !post) {
                res.status(400).json({error: 'Post not found'})
            }else {
                req.post = post
                next()
            }
        })

}

const listByUser = (req, res) => {
    postModel.find({postedBy: req.profile._id})
        // .populate('comments', 'text created')
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .sort('-created')
        .exec((err, posts) => {
            if(err) {
                res.status(400).json({error: errorHandler.getErrorMessage(err)})
            }
            res.status(200).json(posts) 
        })
}

const listNewsFeed = (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id)
    postModel.find({postedBy: {$in: following}})
        // .populate('comments', 'text created')
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .sort('-created')
        .exec((err, posts) => {
            if(err) {
                res.status(400).json({error: errorHandler.getErrorMessage(err)})
            }
            res.status(200).json(posts)
        })
}

const remove = (req, res, next) => {
    let post = req.post
    post.remove((err, deletePost) => {
        if(err) {
            return res.status(400).json({error: errorHandler.getErrorMessage(err)})
        }
        res.status(200).json({message: 'Post deleted'})
    })
}

const like = (req, res) => {
    postModel.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if(err) {
                return res.status(400).json({error: errorHandler.getErrorMessage(err)})
            }
            res.status(200).json(result)
        })
}

const unlike = (req, res) => {
    postModel.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId._id}}, {new: true})
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if(err) {
                return res.status(400).json({error: errorHandler.getErrorMessage(err)})
            }
            res.status(200).json(result)
        })
}

const comment = (req, res) => {
    let comment = req.body.comment
    comment.postedBy = req.body.userId
    postModel.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}}, {new: true})
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if(err) {
                res.status(400).json({error: errorHandler.getErrorMessage(err)})
            }
            res.status(200).json(result)
        })
}

const uncomment = (req, res) => {
    let comment = req.body.commentId
    postModel.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: comment.commentId}}}, {new: true})
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if(err) {
                res.status(400).json({error: errorHandler.getErrorMessage(err)})
            }
            res.status(200).json(result)
        })
}

const photo = (req, res, next) => {
    res.set('Content-Type', req.post.photo.contentType)
    res.send(req.post.photo.data)
}

const isPoster = (req, res, next) => {
    const isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
    if(!isPoster) {
        return res.status(403).json({error: 'User not authorized'})
    }
    next()
}

export default {
    listNewsFeed,
    listByUser,
    create,
    photo, 
    postById,
    isPoster,
    remove,
    like,
    unlike,
    comment,
    uncomment
}