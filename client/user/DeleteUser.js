import React from 'react'
import {remove} from './api-user'
import auth from './../auth/auth-helper'
import {Redirect} from 'react-router-dom'
import Dialog, {DialogTitle, DialogContent, DialogContentText, DialogActions} from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import Button from 'material-ui/Button'
import PropTypes from 'prop-types'

class DeleteUser extends React.Component {
    constructor(props, {match}) {
        super(props)
        this.state = {
            open: false,
            redirect: false
        }
        this.match = match
        this.handleRequestClose = this.handleRequestClose.bind(this)
        this.clickButton = this.clickButton.bind(this)
        this.deleteAccount = this.deleteAccount.bind(this)
    }

    clickButton() {
        this.setState({open: true})
    }

    handleRequestClose() {
        this.setState({open: false})
    }

    deleteAccount() {
        const jwt = auth.isAuthenticated()
        const {userId} = this.props
        remove({userId}, {t: jwt.token}).then((data) => {
            if(data.error) {
                console.log(data.error)
            }else {
                auth.signout(() => console.log('Account deleted'))
                this.setState({redirect: true})
            }
        })
    }

    render() {
        const {open, redirect} = this.state
        if(redirect) {
            return (<Redirect to="/"/>)
        }
        return (
            <span>
                <IconButton aria-label="Delete" onClick={this.clickButton}>
                    <DeleteIcon/>
                </IconButton>
                <Dialog open={open} onClose={this.handleRequestClose}>
                    <DialogTitle>{"Delete Account"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Confirm to delete your account</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleRequestClose} color="primary">Cancle</Button>
                        <Button onClick={this.deleteAccount} color="secondary" autoFocus="autoFocus">Confirm</Button>
                    </DialogActions>
                </Dialog>
            </span>
        )
    }
}

DeleteUser.propTypes = {
    userId: PropTypes.string.isRequired
}

export default DeleteUser