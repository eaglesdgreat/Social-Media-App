import React from 'react'
import { hot } from 'react-hot-loader'
import {MuiThemeProvider} from 'material-ui/styles'
import MainRouter from './MainRouter'
import {BrowserRouter} from 'react-router-dom'
import theme from './../styles/theme'

class App extends React.Component {
    render() {
        return(
            <BrowserRouter>
                <MuiThemeProvider theme={theme}>
                    <MainRouter/>
                </MuiThemeProvider>
            </BrowserRouter>
        )
    }
}

export default hot(module) (App)