import React from 'react'
import {follow, unfollow} from './api-user'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'

class FollowProfileButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.followClick = this.followClick.bind(this)
        this.unfollowClick = this.unfollowClick.bind(this)
    }

    followClick() {
        this.props.onButtonClick(follow)
    }

    unfollowClick() {
        this.props.onButtonClick(unfollow)
    }

    render() {
        return (
            <div>
                { this.props.following 
                    ? (<Button variant="raised" color="secondary" onClick={this.unfollowClick}>Unfollow</Button>)
                    : (<Button variant="raised" color="primary" onClick={this.followClick}>Follow</Button>)
                }
            </div>
        )
    }
}

FollowProfileButton.propTypes = {
    // following: PropTypes.bool.isRequired, ***Fix the isRequired error later*** 
    onButtonClick: PropTypes.func.isRequired
}

export default FollowProfileButton