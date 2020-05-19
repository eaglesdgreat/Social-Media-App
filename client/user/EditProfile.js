import React from 'react'
import auth from './../auth/auth-helper'
import {read, update} from './api-user'
import {Redirect} from 'react-router-dom'
import Card, {CardContent, CardActions} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import  Avatar from 'material-ui/Avatar'
import FileUpload from 'material-ui-icons/FileUpload'
// import profilePic from './../assets/images/profile-pic.png'

const styles = theme => ({
    card: {
      maxWidth: 600,
      margin: 'auto',
      textAlign: 'center',
      marginTop: theme.spacing.unit * 5,
      paddingBottom: theme.spacing.unit * 2
    },
    title: {
      margin: theme.spacing.unit * 2,
      color: theme.palette.protectedTitle
    },
    error: {
      verticalAlign: 'middle'
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 300
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit * 2,
    },
    submit: {
      margin: 'auto',
      marginBottom: theme.spacing.unit * 2
    },
    bigAvatar: {
      width: 60,
      height: 60,
      margin: 'auto'
    },
    input: {
      display: 'none'
    },
    filename:{
      marginLeft:'10px'
    }
})

class EditProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            password: '',
            about: '',
            photo: '',
            redirectToProfile: false,
            userId: '',
            error: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.clickSubmit = this.clickSubmit.bind(this)
    }

    componentDidMount() {
        this.userData =  new FormData()
        const jwt = auth.isAuthenticated()
        const {userId} = this.props.match.params
        read({userId}, {t: jwt.token}).then((data) => {
            if(data.error) {
                this.setState({error: data.error})
            }
            this.setState({name: data.name, email: data.email})
        })
    }

    handleChange(event) {
        const name = event.target.name
        const value = name === 'photo'   
            ? event.target.files[0]
            : event.target.value
        this.userData.set(name, value)
        this.setState({[name]: value})
    }

    clickSubmit() {
        const jwt = auth.isAuthenticated()
        const {userId} = this.props.match.params
        this._currentId = userId
        const user = {
            name: this.state.name || undefined,
            email: this.state.email || undefined,
            password: this.state.password || undefined,
            about: this.state.about || undefined
        }
        update({userId}, {t: jwt.token}, this.userData).then((data) => {
            if(data.error) {
                this.setState({error: data.error})
            }
            if(userId === this._currentId) {
                this.setState({userId: data._id, redirectToProfile: true})
            }
        })
    }

    componentWillUnmount() {
        this._currentId = null
    }
    
    render() {
        const {classes} = this.props
        const {email, password, name, error, redirectToProfile, userId, about, photo} = this.state
        const photoUrl = userId
            ? `/api/users/photo/${userId}?${new Date().getTime()}`
            : '/api/users/defaultphoto'
            
        if(redirectToProfile){
            return (<Redirect to={`/user/${userId}`}/>)
        }
        
        return (
            <div>
                <Card className={classes.card}>
                    <Typography type="headline" component="h2" className={classes.title}>Edit Profile</Typography>
                    <CardContent>
                        <Avatar src={photoUrl} className={classes.bigAvatar}/><br/>
                        <input accept="image/*" type="file" name="photo" onChange={this.handleChange} className={classes.input} id="icon-button-file"/>
                        <label htmlFor="icon-button-file">
                            <Button variant="raised" color="default" component="span">
                                Upload <FileUpload/>
                            </Button>
                        </label> <span className={classes.filename}>{photo ? photo.name : ''}</span><br/>                        
                        <form className={classes.form} >
                            <TextField className={classes.textField} id="name" type="text" label="Name" value={name} onChange={this.handleChange} 
                                margin="normal" variant="outlined" autoFocus required fullWidth name="name"/><br/>
                            <TextField className={classes.textField} id="multiline-flexible" multiline rows="2" label="About" value={about} 
                            onChange={this.handleChange} margin="normal" variant="outlined" required fullWidth name="about"/><br/>
                            <TextField className={classes.textField} id="email" type="email" label="Email" value={email} onChange={this.handleChange} 
                                margin="normal"  variant="outlined" autoComplete="email" required fullWidth name="email"/><br/>
                            <TextField className={classes.textField} id="password" required fullWidth type="password" label="Password" value={password} 
                                onChange={this.handleChange} margin="normal" variant="outlined" autoComplete="current-password"
                                name="password"/><br/>
                        </form>
                        {error && (<Typography component="p" color="error">
                            <Icon color="error" className={classes.error}></Icon>
                            {error}
                        </Typography>)}
                    </CardContent>
                    <CardActions>
                        <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

EditProfile.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles) (EditProfile)