import React from 'react'
import auth from './../auth/auth-helper'
import {findPeople, follow} from  './api-user'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import List, {ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import ViewIcon from 'material-ui-icons/Visibility'
import {Link} from 'react-router-dom'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'

const styles = theme => ({
    root: theme.mixins.gutters({
      padding: theme.spacing.unit,
      margin: 0
    }),
    title: {
      margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
      color: theme.palette.openTitle,
      fontSize: '1em'
    },
    avatar: {
      marginRight: theme.spacing.unit * 1
    },
    follow: {
      right: theme.spacing.unit * 2
    },
    snack: {
      color: theme.palette.protectedTitle
    },
    viewButton: {
      verticalAlign: 'middle'
    }
})

class FindPeople extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            open: false
        }
        this.handleRequestClose = this.handleRequestClose.bind(this)
        this.clickFollow = this.clickFollow.bind(this)
    }

    componentDidMount() {
        const jwt = auth.isAuthenticated()
        findPeople({userId: jwt.user._id}, {t: jwt.token}).then((data) => {
            if(data.error) {
                this.setState({error: data.error})
            }
            this.setState({users: data})
        })
    }

    handleRequestClose(event, reason) {
        this.setState({open: false})
    }

    clickFollow(user, index) {
        const jwt = auth.isAuthenticated()
        follow({userId: jwt.user._id}, {t: jwt.token}, user._id).then((data) => {
            if(data.error) {
                this.setState({error: data.error})
            }else {
                let toFollow = this.state.users
                toFollow.splice(index, 1)
                this.setState({users: toFollow, open: true, followMessage: `Following ${user.name}!`})
            }
        })
    }

    render() {
        const {classes} = this.props
        const {users, open, followMessage} = this.state
        return (
            <div>
                <Paper className={classes.root} elevation={4}>
                    <Typography type="title" className={classes.title}>
                        Who To Follow
                    </Typography>
                    <List>{users.map((item, i) => {
                        return <span key={i}>
                            <ListItem>
                                <ListItemAvatar className={classes.avatar}>
                                    <Avatar src={`/api/users/photo/${item._id}`}/>
                                </ListItemAvatar>
                                <ListItemText primary={item.name}/>
                                <ListItemSecondaryAction className={classes.follow}>
                                    <Link to={`/user/${item._id}`}>
                                        <IconButton variant="raised" color="secondary" className={classes.viewButton}>
                                            <ViewIcon/>
                                        </IconButton>
                                    </Link>
                                    <Button aria-label="Follow" color="primary" onClick={this.clickFollow.bind(this, item, i)} variant="raised">
                                        Follow
                                    </Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </span>
                    })}</List> 
                </Paper>
                <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                open={open}
                onClose={this.handleRequestClose}
                autoHideDuration={6000}
                message={<span className={classes.snack}>{followMessage}</span>}/>
            </div>
        )
    }
}

FindPeople.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles) (FindPeople)