import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import SignUp from './user/SignUp'
import SignIn from './auth/SignIn'
import Profile from './user/Profile'
import PrivateRoute from './auth/PrivateRoute'
import EditProfile from './user/EditProfile'
import Menu from './core/Menu'

class MainRouter extends React.Component {
    componentDidMount() {
        const jssStyles = document.getElementById('jss-server-side')
        if(jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles)
        }
    }

    render() {
        return (
            <div>
                <Menu/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/users" component={Users}/>
                    <Route path="/signup" component={SignUp}/>
                    <Route path="/signin" component={SignIn}/>
                    <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
                    <Route path="/user/:userId" component={Profile}/>
                </Switch>
            </div>
        )
    }
}

export default MainRouter