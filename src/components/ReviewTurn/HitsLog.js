import React, { Component } from 'react';
import _ from 'lodash'

class HitsLog extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  render () {
    const currentTurn = this.props.appState.gameState.turns.currentTurn

    const hitLogArray = _.chain(this.props.appState.gameState.turns['turn' + currentTurn])
      .values()
      .filter((turnObj) => {
        return _.startsWith(turnObj.skill, 'HIT')
      })
      .map((turnObj) => {
        const targetName = this.props.appState.gameState.players[turnObj.target].name
        return targetName + ' was hit!'
      })
      .sortBy() // default alphabetical
      .valueOf()

    if (hitLogArray.length) {
      return (
        <div>
          <h4>Turn {currentTurn} hits review:</h4>
          <ul>
            {hitLogArray.map((hitLog, index) => {
              return <li key={hitLog + index}>{hitLog}</li>
            })}
          </ul>
        </div>
      )
    }
    else {
      return <div>Nobody was hit. Boring.</div>
    }
  }
}

export default HitsLog
