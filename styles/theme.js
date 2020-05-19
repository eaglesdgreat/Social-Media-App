import {createMuiTheme} from 'material-ui/styles'
import {green, yellow} from 'material-ui/colors'

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#757de8',
            main: '#3f51b5',
            dark: '#002984',
            contrastText: '#fff'
        },
        secondary: {
            light: '#ff79b0',
            main: '#ff4081',
            dark: '#c60055',
            contrastText: '#000'
        },
        openTitle: green['700'],
        protectedTitle: yellow['700'],
        type: 'light'
    }
})

export default theme