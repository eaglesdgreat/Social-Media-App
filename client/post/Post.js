import React from 'react'
import auth from './../auth/auth-helper'
import Card, {CardHeader, CardContent, CardActions} from 'material-ui/Card'
import {Link} from 'react-router-dom'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import Typography from 'material-ui/Typography'
import FavoriteIcon from 'material-ui-icons/Favorite'
import CommentIcon from 'material-ui-icons/Comment'
import FavoriteBorderIcon from 'material-ui-icons/FavoriteBorder'
import Divider from 'material-ui/Divider'
import Comments from './Comments'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {remove, like, unlike} from './api-post'
import Avatar from 'material-ui/Avatar'
import Icon from 'material-ui/Icon'

const styles = theme => ({
    card: {
      maxWidth:600,
      margin: 'auto',
      marginBottom: theme.spacing.unit*3,
      backgroundColor: 'rgba(0, 0, 0, 0.06)'
    },
    cardContent: {
      backgroundColor: 'white',
      padding: `${theme.spacing.unit*2}px 0px`
    },
    cardHeader: {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit
    },
    text: {
      margin: theme.spacing.unit*2
    },
    photo: {
      textAlign: 'center',
      backgroundColor: '#f2f5f4',
      padding:theme.spacing.unit
    },
    media: {
      height: 200
    },
    button: {
     margin: theme.spacing.unit,
    }
})

class Post extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            like: false,
            likes: 0,
            comments: []
        }
        this.deletePost = this.deletePost.bind(this)
        this.like = this.like.bind(this)
        this.updateComments = this.updateComments.bind(this)
    }

    checkLike(likes) {
        const jwt = auth.isAuthenticated()
        let match = likes.indexOf(jwt.user._id) !== -1
        return match
    }

    componentDidMount() {
        this.currentUserId = auth.isAuthenticated().user._id
        this._currentId = this.props.post._id 
        this.setState({like: this.checkLike(this.props.post.likes), likes: this.props.post.likes.length, comments: this.props.post.comments})
    }

    componentDidUpdate(prevProps, prevState) {
        this.currentUserId = auth.isAuthenticated().user._id
        this._currentId = this.props.post._id 
        if(this.props.post._id !== prevProps.post._id){
            this.setState({
                like: this.checkLike(this.props.post.likes),
                likes: this.props.post.likes.length,
                comments: this.props.post.comments
            })
        }
    }

    like() {
        const jwt = auth.isAuthenticated()
        let callApi = this.state.like ? unlike : like
        callApi({userId: jwt.user}, {t: jwt.token}, this.props.post._id).then((data) => {
            if(data.error) {
                console.log(data.error)
            }else {
                this.setState({like: !this.state.like, likes: data.likes.length})
            }
        })
    }

    updateComments(comments) {
        this.setState({comments})
    }

    deletePost() {
        const jwt = auth.isAuthenticated()
        remove({postId: this.props.post._id}, {t: jwt.token}).then((data) => {
            if(data.error) {
                console.log(data.error)
            }else {
                this.props.onRemoved(this.props.post)
            }
        })
    }

    componentWillUnmount() {
        this._currentId = null
        this.currentUserId = null
    }

    render() {
        const {classes} = this.props
        const {like, likes, comments} = this.state
        return (
            <div>
                <Card className={classes.card}>
                    <CardHeader
                    avatar={<Avatar src={`/api/users/photo/${this.props.post.postedBy._id}?${new Date().getTime()}`}/>}
                    action={this.props.post.postedBy._id === auth.isAuthenticated().user._id &&
                    <IconButton onClick={this.deletePost}>
                        <DeleteIcon/>
                    </IconButton>}
                    title={<Link to={`/user/${this.props.post.postedBy._id}`}>
                        {this.props.post.postedBy.name}
                    </Link>} 
                    subheader={(new Date(this.props.post.created)).toDateString()}
                    className={classes.cardHeader}
                    />
                    <CardContent className={classes.cardContent}>
                        <Typography className={classes.text} component="p">
                            {this.props.post.text}
                        </Typography>
                        {this.props.post.photo && (
                            <div className={classes.photo}>
                                <img className={classes.media} src={`/api/posts/photo/${this.props.post._id}`}/>
                            </div>
                        )}
                    </CardContent>
                    <CardActions>
                        {like
                        ?<IconButton onClick={this.like} className={classes.button} aria-label="Like" color="secondary">
                            <FavoriteIcon/>
                        </IconButton>
                        :<IconButton onClick={this.like} className={classes.button} aria-label="Unlike" color="secondary">
                            <FavoriteBorderIcon/>
                        </IconButton>}<span>{likes}</span>
                        <Icon className={classes.button} aria-label="Comment" color="secondary">
                            <CommentIcon/>
                        </Icon><span>{comments.length}</span>
                    </CardActions>
                    <Divider/>
                    <Comments postId={this.props.post._id} comments={comments} updateComments={this.updateComments}/>
                </Card>
            </div>
        )
    }
}

Post.propTypes = {
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    onRemoved: PropTypes.func.isRequired
}

export default withStyles(styles) (Post)