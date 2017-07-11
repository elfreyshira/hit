import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

import App from './App'
import './index.css'
import pages from './pages'

// THE MOST GHETTO ROUTING EVER WOOHOO!!
let toRender
let PageComponent = pages[_.chain(window.location.pathname).split('/').compact().last().valueOf()]
if (PageComponent) {
  toRender = <PageComponent />
}
else {
  toRender = <App />
}

ReactDOM.render(toRender, document.getElementById('root'))
