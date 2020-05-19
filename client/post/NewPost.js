import React from 'react'
import auth from './../auth/auth-helper'
import {create} from './api-post'
import Card, {CardHeader, CardContent, CardActions} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import PhotoCamera from 'material-ui-icons/PhotoCamera'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import Button from 'material-ui/Button'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Avatar from 'material-ui/Avatar'

const styles = theme => ({
    root: {
      backgroundColor: '#efefef',
      padding: `${theme.spacing.unit*3}px 0px 1px`
    },
    card: {
      maxWidth:600,
      margin: 'auto',
      marginBottom: theme.spacing.unit*3,
      backgroundColor: 'rgba(65, 150, 136, 0.09)',
      boxShadow: 'none'
    },
    cardContent: {
      backgroundColor: 'white',
      paddingTop: 0,
      paddingBottom: 0
    },
    cardHeader: {
      paddingTop: 8,
      paddingBottom: 8
    },
    photoButton: {
      height: 30,
      marginBottom: 5
    },
    input: {
      display: 'none',
    },
    textField: {
      marginLeft: theme.spacing.unit*2,
      marginRight: theme.spacing.unit*2,
      width: '90%'
    },
    submit: {
      margin: theme.spacing.unit * 2
    },
    filename:{
      verticalAlign: 'super'
    }
})

class NewPost extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            photo: '',
            text: '',
            user: {},
            error: ''
        }
        this.clickPost = this.clickPost.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        this.postData = new FormData()
        this.setState({user: auth.isAuthenticated().user})
    }

    handleChange(event) {
        const name = event.target.name
        const value = name === 'photo'
            ? event.target.files[0]
            : event.target.value
        this.postData.set(name, value)
        this.setState({[name]: value})
    }

    clickPost() {
        const jwt = auth.isAuthenticated()
        create({userId: jwt.user._id}, {t: jwt.token}, this.postData).then((data) => {
            if(data.error) {
                this.setState({error: data.error})
            }else {
                this.setState({text: '', photo: ''})
                this.props.addUpdate(data)
            }
        })
    }

    render() {
        const {classes} = this.props
        const {photo, text, user, error} = this.state
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardHeader 
                    avatar={<Avatar src={'/api/users/photo/' + user._id + '?' + new Date().getTime()}/>}
                    title={user.name}
                    className={classes.cardHeader}
                    />
                    <CardContent className={classes.cardContent}>
                        <TextField 
                        name="text"
                        className={classes.textField}
                        placeholder="Share your thoughts..."
                        multiline
                        rows="3"
                        value={text}
                        onChange={this.handleChange}
                        margin="normal"
                        />
                        <input accept="image/*" name="photo" type="file" onChange={this.handleChange} className={classes.input}
                            id="icon-button-file"/>
                        <label htmlFor="icon-button-file">
                            <IconButton color="secondary" className={classes.photoButton} component="span">
                                <PhotoCamera/>
                            </IconButton>
                        </label><span className={classes.filename}>{photo ? photo.name : ''}</span>
                        {error && (
                            <Typography component="p" color="error">
                                <Icon className={classes.error} color="error">error</Icon>
                                {error}
                            </Typography>
                            )
                        }
                    </CardContent>
                    <CardActions>
                        <Button variant="raised" onClick={this.clickPost} disabled={text === ''} color="primary" className={classes.submit}>
                            Post
                        </Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

NewPost.propTypes = {
    classes: PropTypes.object.isRequired,
    addUpdate: PropTypes.func.isRequired
}

export default withStyles(styles) (NewPost)