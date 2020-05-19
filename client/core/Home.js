import React from 'react'
import Card, {CardContent, CardMedia} from 'material-ui/Card'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import SeaShell from './../assets/images/seashell.jpg'
import Grid from 'material-ui/Grid'
import FindPeople from './../user/FindPeople'
import auth from './../auth/auth-helper'
import NewsFeed from './../post/NewsFeed'

const styles = theme => ({
    root: {
      flexGrow: 1,
      margin: 30,
    },
    card: {
      maxWidth: 600,
      margin: 'auto',
      marginTop: theme.spacing.unit * 5
    },
    title: {
      padding:`${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
      color: theme.palette.text.secondary
    },
    media: {
      minHeight: 330
    }
})

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultPage: true
        }
    }

    init() {
        if(auth.isAuthenticated()) {
            this.setState({defaultPage: false})
        }else {
            this.setState({defaultPage: true})
        }
    }

    componentDidMount() {
        this.init()
    }

    componentDidUpdate(prevProps, prevState) {
        this._currentid = this.state.defaultPage
        if(this.state.defaultPage !== prevState.defaultPage) {
            this.init()
        }
    }

    componentWillUnmount() {
        this._currentid = null
    }

    render() {
        const {classes} = this.props
        const {defaultPage} = this.state
        return (
            <div className={classes.root}>
                {defaultPage && 
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <Card className={classes.card}>
                                <Typography type="headline" component="h1" className={classes.title}> Home Page </Typography>
                                <CardMedia className={classes.media} image={SeaShell} title="Unicorn Shells"/>
                                <CardContent>
                                    <Typography type="body1" component="p">
                                        Welcome To The Social Media Home Page
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                }
                {!defaultPage && 
                    <Grid container spacing={24}>
                        <Grid item xs={8} sm={7}>
                            <NewsFeed/>
                        </Grid>

                        <Grid item xs={6} sm={5}>
                            <FindPeople/>
                        </Grid>
                    </Grid>
                }
            </div>
        )
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles) (Home)