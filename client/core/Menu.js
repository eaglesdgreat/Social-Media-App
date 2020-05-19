import React from 'react'
import {withRouter, Link} from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import ToolBar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui-icons/Home'
import Button from 'material-ui/Button'
import auth from './../auth/auth-helper'
// import Profile from './../user/Profile'

const isActive = (history, path) => {
    if(history.location.pathname == path) {
        return {color: '#ff4081'}
    }else {
        return {color: '#ffffff'}
    }
}

const Menu = withRouter(({history}) => (
    <div>
        <AppBar position="static">
            <ToolBar>
                <Typography type="title" color="inherit">Social Media</Typography>
                <Link to="/">
                    <IconButton aria-label="Home" style={isActive(history, "/")}>
                        <HomeIcon/>
                    </IconButton>
                </Link>
                <Link to="/users">
                    <Button style={isActive(history, "/users")}>Users</Button>
                </Link>
                {!auth.isAuthenticated() && (<span>
                    <Link to="/signup">
                        <Button style={isActive(history, "/signup")}>Sign Up</Button>
                    </Link>
                    <Link to="/signin">
                        <Button style={isActive(history, "/signin")}>Sign In</Button>
                    </Link>
                </span>)
                }
                
                {auth.isAuthenticated() && (<span>
                    <Link to={`/user/${auth.isAuthenticated().user._id}`}>
                        <Button style={isActive(history, `/user/${auth.isAuthenticated().user._id}`)}>My Profile</Button>
                    </Link>
                    <Button color="inherit" onClick={() => auth.signout(() => history.push('/signin'))}>Sign Out</Button>
                </span>)}
            </ToolBar>
        </AppBar>
    </div>
)) 

export default Menu