import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// const method = ReactDOM.render ? ReactDOM.render : ReactDOM.hydrate

ReactDOM.hydrate(
    <App/>,
    document.getElementById('root')
)