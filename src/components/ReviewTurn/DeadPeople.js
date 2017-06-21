import React, { Component } from 'react';
import _ from 'lodash'

class DeadPeople extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  render () {
    const deadPeople = _.chain(this.props.appState.gameState.players)
      .filter((playerObj) => (playerObj.health <= 0))
      .map('name')
      .map((deadName) => <li key={deadName}>{deadName}</li>)
      .valueOf()

    return (
      <div>
        <h4>These people are dead (RIP):</h4>
        <ul>{deadPeople}</ul>
      </div>
    )
  }
}

export default DeadPeople
