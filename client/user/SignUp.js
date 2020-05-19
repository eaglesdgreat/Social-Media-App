import React from 'react'
import {create } from './api-user'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Icon from 'material-ui/Icon'
import {withStyles} from 'material-ui/styles'
import Card, {CardContent, CardActions} from 'material-ui/Card'
import {Link} from 'react-router-dom'
import Dialog, {DialogTitle, DialogContent, DialogContentText, DialogActions} from 'material-ui/Dialog'

const styles = theme => ({
    card: {
        maxWidth: 600,
        textAlign: 'center',
        margin: 'auto',
        marginTop: theme.spacing.unit * 5,
        paddingBottom: theme.spacing.unit * 2
    },
    error: {
        verticalAllign: 'middle'
    },
    title: {
        marginTop: theme.spacing.unit * 2,
        color: theme.palette.openTitle
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
    }
})

class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            password: '',
            error: '',
            open: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.clickSubmit = this.clickSubmit.bind(this)
    }

    handleChange(event) {
        const name = event.target.name
        const value = event.target.value
        this.setState({[name]: value})
    }

    clickSubmit() {
        const user = {
            name: this.state.name || undefined,
            email: this.state.email || undefined,
            password: this.state.password || undefined
        }
        create(user).then((data) => {
            if(data.error) {
                this.setState({error: data.error})
            }else {
                this.setState({
                    error: '',
                    open: true
                })
            }
        })
    }

    render() {
        const {classes} = this.props
        const {name, open, email, password, error} = this.state
        return (
            <div>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography type="headline" component="h2" className={classes.title}>Sign Up Here</Typography>
                        <form className={classes.form} noValidate>
                            <TextField className={classes.textField} id="name" type="text" label="Name" value={name} onChange={this.handleChange} 
                                margin="normal" variant="outlined" autoComplete="text" name="name" autoFocus required fullWidth/><br/>
                            <TextField className={classes.textField} id="email" type="email" label="Email" value={email} onChange={this.handleChange} 
                                margin="normal" variant="outlined" autoComplete="email" required fullWidth name="email"/><br/>
                            <TextField className={classes.textField} id="password" type="password" label="Password" value={password} name="password"
                            onChange={this.handleChange} margin="normal" autoComplete="current-password" variant="outlined" required fullWidth/><br/>
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
                <Dialog open={open} disableBackdropClick={true}>
                    <DialogTitle>New Account</DialogTitle>
                    <DialogContent>
                        <DialogContentText>New Account Created Successfully.</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Link to="/signin">
                            <Button color="primary" autoFocus="autoFocus" variant="raised">Sign In</Button>
                        </Link>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

SignUp.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles) (SignUp)