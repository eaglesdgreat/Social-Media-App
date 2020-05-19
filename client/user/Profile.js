import React from 'react'
import {read, update} from './api-user'
import auth from './../auth/auth-helper'
import {Redirect, Link} from 'react-router-dom'
import Paper from 'material-ui/Paper'
import List, {ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction} from 'material-ui/List'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'
import Edit from 'material-ui-icons/Edit'
import DeleteUser from '../user/DeleteUser'
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import FollowProfileButton from './FollowProfileButton'
import ProfileTabs from './ProfileTabs' 
import {listByUser} from './../post/api-post'

const styles = theme => ({
    root: theme.mixins.gutters({
      maxWidth: 600,
      margin: 'auto',
      padding: theme.spacing.unit * 3,
      marginTop: theme.spacing.unit * 5
    }),
    title: {
      margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 2}px`,
      color: theme.palette.protectedTitle
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 10
    }
})

class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {following: [], followers: []},
            following: false,
            redirectToSignin: false, 
            posts: []
        }
        this.checkFollow = this.checkFollow.bind(this)
        this.init = this.init.bind(this)
        this.clickFollowButton = this.clickFollowButton.bind(this)
        this.removePost = this.removePost.bind(this)
    }

    init(userId) {
        this._currentId = userId
        const jwt = auth.isAuthenticated()
        read({userId}, {t: jwt.token}).then((data) => {
            if(data.error) {
                this.setState({redirectToSignin: true})
            }else {
                let following = this.checkFollow(data)
                this.setState({user: data, following})
                this.loadPosts(data._id)
            }
            // if(userId === this._currentId){ 
            //     let following = this.checkFollow(data)
            //     this.setState({user: data, following}) 
            // }
        })
    }

    // static getDerivedStateFromProps(props, state) {    
    //     // Store prevId in state so we can compare when props change.    
    //     // Clear out previously-loaded data (so we don't render stale stuff).    
    //     if (props.match.params.userId !== state.prevId) {      
    //         return {        
    //             user: null, 
    //             prevId: props.match.params.userId,      
    //         };    
    //     }    
    //     // No state update necessary    
    //     return null;  
    // }

    componentDidMount() {
        const {userId}= this.props.match.params
        // const {match: {params}} = this.props
        this.init(userId)
    }

    componentDidUpdate(prevProps, prevState) {
        const {userId} = this.props.match.params
        if(userId !== prevProps.match.params.userId) {
            this.init(userId)
        }
    }

    checkFollow(user) {
        const jwt = auth.isAuthenticated()
        const match = user.followers.find((follower) => {
            return follower._id == jwt.user._id
        })
        return match
    }

    clickFollowButton(callApi) {
        const jwt = auth.isAuthenticated()
        callApi({userId: jwt.user._id}, {t: jwt.token}, this.state.user._id).then((data) => {
            if(data.error) {
                this.setState({error: data.error})
            }else {
                this.setState({user: data, following: !this.state.following})
            }
        })
    }

    componentWillUnmount(){
        this._currentId = null
        console.log('Unmounted')
    }

    loadPosts(user) {
        const jwt = auth.isAuthenticated()
        listByUser({userId: user}, {t: jwt.token}).then((data) => {
            if(data.error) {
                console.log(data.error)
            }else {
                this.setState({posts: data})
            }
        })
    }

    removePost(post) {
        const updatedPost = this.state.posts
        const index = updatedPost.indexOf(post)
        updatedPost.splice(index, 1)
        this.setState({posts: updatedPost})
    }

    render() {
        const {classes} = this.props
        const {redirectToSignin, user, following, posts} = this.state
        const photoUrl = user._id === this.props.match.params.userId
            ? `/api/users/photo/${user._id}?${new Date().getTime()}`
            : '/api/users/defaultphoto'

        if(redirectToSignin) {
            return (<Redirect to="/signin"/>)
        }
        return (
            <div>
                <Paper className={classes.root} elevation={4}>
                    <Typography type="title" className={classes.title}>Profile</Typography>
                    <List dense>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar src={photoUrl} className={classes.bigAvatar}/>
                            </ListItemAvatar>
                            
                            <ListItemText primary={user.name} secondary={user.email}/>
                            {auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id
                               ? (<ListItemSecondaryAction>
                                    <Link to={'/user/edit/' + user._id}>
                                        <IconButton aria-label="Edit" color="primary">
                                            <Edit/>
                                        </IconButton>
                                    </Link>
                                    <DeleteUser userId={user._id}/>
                              </ListItemSecondaryAction>)
                              : (<FollowProfileButton following={following} onButtonClick={this.clickFollowButton}/>)
                            }
                        </ListItem>
                        <Divider/>
                        <ListItem>
                            <ListItemText primary={user.about} secondary={"Joined: " + (new Date(user.created).toDateString())}/>
                        </ListItem>
                    </List>
                    <ProfileTabs user={user} posts={posts} removePostUpdate={this.removePost}/>
                </Paper>
            </div>
        )
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles) (Profile)