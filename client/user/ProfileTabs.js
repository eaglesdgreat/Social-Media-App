import React from 'react'
import AppBar from 'material-ui/AppBar'
import Tabs, {Tab} from 'material-ui/Tabs'
import FollowGrid from './FollowGrid'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import PostList from './../post/PostList'

class ProfileTabs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tab: 0
        }
        this.handleTabChange = this.handleTabChange.bind(this)
    }

    handleTabChange(event, value) {
        this.setState({tab: value})
    }

    render() {
        const {tab} = this.state
        return (
            <div>
                <AppBar position="static" color="default">
                    <Tabs value={tab} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary" fullWidth>
                        <Tab label="Posts"/>
                        <Tab label="Following"/>
                        <Tab label="Followers"/>
                    </Tabs>
                </AppBar>
                {tab === 0 && <TabContainer><PostList removeUpdate={this.props.removePostUpdate} posts={this.props.posts}/></TabContainer>}
                {tab === 1 && <TabContainer><FollowGrid people={this.props.user.following}/></TabContainer>}
                {tab === 2 && <TabContainer><FollowGrid people={this.props.user.followers}/></TabContainer>}
            </div>
        )
    }
}

ProfileTabs.propTypes = {
    user: PropTypes.object.isRequired
}

const TabContainer =  (props) => {
    return (
        <Typography component="div" style={{padding: 8 * 2}}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

export default ProfileTabs