import userModel from './../models/user.model'
import errorHandler from './../helpers/dbErrorHandler'
import _ from 'lodash'
import formidable from 'formidable'
import fs from 'fs'
import profilePic from './../../client/assets/images/profile-pic.png'

const create = (req, res, next) => {
    const user = new userModel(req.body)
    user.save((err, result) => {
        if(err) {
            return res.status(400).json({error: errorHandler.getErrorMessage(err)})
        }
        res.status(200).json({message: 'Successfully signed up'})
    })
}

const list = (req, res) => {
    userModel.find((err, users) => {
        if(err) {
            return res.status(400).json({error: errorHandler.getErrorMessage(err)})
        }
        res.status(200).json(users)
    }).select('name email created updated')
}

const userByID = (req, res, next, id) => {
    userModel.findById({_id: id})
    .populate('following','_id name')
    .populate('followers', '_id name')
    .exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({error: "User not found"})
        }else {
            req.profile = user
            next()
        }
    })
}

const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

const update = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            })
        }
        let user = req.profile
        user = _.extend(user, fields)
        user.updated = Date.now()
        if(files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path)
            user.photo.contentType = files.photo.type
        }
        user.save((err, result) => {
            if(err) {
                return res.status(400).json({error: errorHandler.getErrorMessage(err)})
            }
            user.hashed_password = undefined
            user.salt = undefined
            res.status(200).json(user)
        })
    })
}

const remove = (req, res, next) => {
    let user = req.profile
    user.remove((err, deletedUser) => {
        if(err) {
            return res.status(400).json({error: errorHandler.getErrorMessage(err)})
        }
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.status(200).json({message: 'User Account Deleted Successfully'})
    })
}

const photo = (req, res, next) => {
    let pic = req.profile
    if(pic.photo.data) {
        res.set('Content-Type', pic.photo.contentType)
        return res.send(pic.photo.data)
    }
    next()
}

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + profilePic)
}

const addFollowing = (req, res, next) => {
    userModel.findByIdAndUpdate(req.body.userId, {$push: {following: req.body.followId}}, (err, result) => {
        if(err) {
            return res.status(400).json({error: errorHandler.getErrorMessage(err)})
        }
    })
    next()
}

const addFollower = (req, res, next) => {
    userModel.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}}, {new: true})
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if(err) {
                return res.status(400).json({error: errorHandler.getErrorMessage(err)})
            }
            result.hashed_password = undefined
            result.salt = undefined
            res.status(200).json(result)
        })
}

const removeFollowing = (req, res, next) => {
    userModel.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}}, (err, result) => {
        if(err) {
            return res.status(400).json({error: errorHandler.getErrorMessage(err)})
        }
        next()
    })
}

const removeFollower = (req, res, next) => {
    userModel.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}}, {new: true})
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if(err) {
                return res.status(400).json({error: errorHandler.getErrorMessage(err)})
            }
            result.hashed_password = undefined
            result.salt = undefined
            res.status(200).json(result)
        })
}

const findPeople = (req, res, next) => {
    let following = req.profile.following
    following.push(req.profile._id)
    userModel.find({_id: {$nin: following}}, (err, users) => {
        if(err) {
            return res.status(400).json({error: errorHandler.getErrorMessage(err)})
        }
        res.status(200).json(users)
    }).select('name')
}

export default {
    create, 
    list, 
    userByID,
    read, 
    update, 
    remove, 
    photo, 
    defaultPhoto, 
    addFollower, 
    addFollowing, 
    removeFollower, 
    removeFollowing,
    findPeople
}