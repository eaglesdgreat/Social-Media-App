import React from 'react'
import {CardHeader} from 'material-ui/Card'
import auth from './../auth/auth-helper'
import {comment, uncomment} from './api-post'
import Avatar from 'material-ui/Avatar'
import TextField from 'material-ui/TextField'
import {Link} from 'react-router-dom'
import IconButton from 'material-ui/IconButton'
import {withStyles} from 'material-ui/styles'
import PropTypes from 'prop-types'
import DeleteIcon from 'material-ui-icons/Delete'

const styles = theme => ({
    cardHeader: {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit
    },
    smallAvatar: {
      width: 25,
      height: 25
    },
    commentField: {
      width: '96%'
    },
    commentText: {
      backgroundColor: 'white',
      padding: theme.spacing.unit,
      margin: `2px ${theme.spacing.unit*2}px 2px 2px`
    },
    commentDate: {
      display: 'block',
      color: 'gray',
      fontSize: '0.8em'
   },
   commentDelete: {
     fontSize: '1.6em',
     verticalAlign: 'middle',
     cursor: 'pointer'
   }
})

class Comments extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: ''
        }
        this.addComment = this.addComment.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.deleteComment = this.deleteComment.bind(this)
    }

    handleChange(event) {
        const value = event.target.value
        this.setState({text: value})
    }

    addComment(event) {
        if(event.keyCode == 13 && event.target.value) {
            event.preventDefault()
            const jwt = auth.isAuthenticated()
            comment({userId: jwt.user._id}, {t: jwt.token}, this.props.postId, {text: this.state.text}).then((data) => {
                if(data.error) {
                    console.log(data.error)
                }
                this.setState({text: ''})
                this.props.updateComments(data.comments)
            })
        }
    }

    deleteComment(commentId) {
        const jwt = auth.isAuthenticated()
        uncomment({userId: jwt.user._id}, {t: jwt.token}, this.props.postId, {commentId}).then(data => {
            if(data.error) {
                console.log(data.error)
            }
            this.props.updateComments(data.comments)
        })
    }

    render() {
        const {classes} = this.props
        const {text} = this.state
        const commentBody = item => {
            return (
                <p className={classes.commentText}>
                    <Link to={`/user/${item.postedBy._id}`}>{item.postedBy.name}</Link><br/>
                    {item.text}
                    <span className={classes.commentDate}>
                        {(new Date(item.created)).toDateString()} |     
                        {auth.isAuthenticated().user._id === item.postedBy._id && 
                        <IconButton className={classes.commentDelete} onClick={this.deleteComment.bind(this, item._id)}><DeleteIcon/></IconButton>}
                    </span>
                </p>
            )
        }
        return (
            <div>
                <CardHeader
                    avatar={<Avatar className={classes.smallAvatar} src={`/api/users/photo/${auth.isAuthenticated().user._id}?${new Date().getTime()}`}/>}
                    title={<TextField
                            onKeyDown={this.addComment}
                            value={text}
                            multiline
                            onChange={this.handleChange}
                            margin="normal"
                            placeholder="Comment Something"
                            className={classes.commentField}/>}
                    className={classes.cardHeader}
                />
                {this.props.comments.map((item, i) => {
                    return <CardHeader
                                avatar={<Avatar className={classes.smallAvatar} src={`/api/users/photo/${item.postedBy._id}?${new Date().getTime()}`}/>}
                                title={commentBody(item)}
                                className={classes.cardHeader}
                                key={i}
                            />
                })}
            </div>
        )
    }
}

Comments.propTypes = {
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    updateComments: PropTypes.func.isRequired
}

export default withStyles(styles) (Comments)