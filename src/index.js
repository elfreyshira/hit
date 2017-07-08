import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

import App from './App'
import './index.css'
import { PROFESSIONS } from './util/professions'

function ListOfProfessions () {
  return (
    <div>
      <h1>All professions from Hit</h1>
      <span><a href="/">Play the game</a></span>
      <hr />
      <hr />
      {_.shuffle(_.map(PROFESSIONS, (professionObj, professionId) => {
        // name description startingHealth type
        return (
          <div key={professionId}>
            <h3>{professionObj.name}</h3>
            <p>Type: {_.capitalize(professionObj.type)}</p>
            <p>Description: {professionObj.description}</p>
            <p>Starting health: {professionObj.startingHealth}</p>
            <hr />
          </div>
        )
      }))}
    </div>
  )
}

// THE MOST GHETTO ROUTING EVER WOOHOO!!
let toRender
if (_.includes(window.location.pathname, 'professions')) {
  toRender = <ListOfProfessions />
}
else {
  toRender = <App />
}

ReactDOM.render(toRender, document.getElementById('root'))
