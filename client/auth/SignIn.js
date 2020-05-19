import React from 'react'
import auth from './auth-helper'
import {signin} from './auth-api'
import {Redirect} from 'react-router-dom'
import Card, {CardContent, CardActions} from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'


const styles = theme => ({
    card: {
      maxWidth: 600,
      margin: 'auto',
      textAlign: 'center',
      marginTop: theme.spacing.unit * 5,
      paddingBottom: theme.spacing.unit * 2
    },
    error: {
      verticalAlign: 'middle'
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

class SignIn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            error: '',
            redirectToReferer: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.clickSubmit = this.clickSubmit.bind(this)
    }

    handleChange(event) {
        const name = event.target.id
        this.setState({[name]: event.target.value})
    }

    clickSubmit() {
        const user = {
            email: this.state.email || undefined,
            password: this.state.password || undefined
        }
        signin(user).then((data) => {
            if(data.error) {
                this.setState({error: data.error})
            }else {
                auth.authenticate(data, () => {
                    this.setState({redirectToReferer: true})
                })
            }
        })
    }

    render() {
        const {classes} = this.props
        const {email, password, error, redirectToReferer} = this.state
        const {from} = this.props.location.state || { from : {pathname: '/'}}
        if(redirectToReferer) {
            return (<Redirect to={from}/>)
        }
        return(
            <Card className={classes.card}>
                    <CardContent>
                        <Typography type="headline" component="h2" className={classes.title}>Sign In Here</Typography>
                        <form className={classes.form} noValidate>
                            <TextField className={classes.textField} id="email" type="email" label="Email" value={email} onChange={this.handleChange}
                                margin="normal" variant="outlined" autoComplete="email" autoFocus required fullWidth/><br/>
                            <TextField className={classes.textField} variant="outlined" id="password" type="password" label="Password" value={password} 
                                onChange={this.handleChange} margin="normal" autoComplete="current-password" required fullWidth/><br/>
                        </form>
                        {error && (<Typography component="p" color="error">
                            <Icon color="error" className={classes.error}></Icon>
                            {error}
                        </Typography>)}
                    </CardContent>
                    <CardActions>
                        <Button onClick={this.clickSubmit} color="primary" variant="raised" className={classes.submit}>Submit</Button>
                    </CardActions>
            </Card>
        )
    }
} 

SignIn.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles) (SignIn)