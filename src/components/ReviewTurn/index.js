import React, { Component } from 'react';
import _ from 'lodash'

import actions from '../../actions'
import { PROFESSIONS, SKILLS } from '../../util/professions'

import Button from '../Button'
import PlayerInfo from '../PlayerInfo'
import WaitingBlock from '../WaitingBlock'

class ReviewTurn extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  state = {
    isWaiting: false
  }

  renderTurnMoves = () => {
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
        <ul>
          {hitLogArray.map((hitLog, index) => {
            return <li key={hitLog + index}>{hitLog}</li>
          })}
        </ul>
      )
    }
    else {
      return 'Nobody was hit. Boring.'
    }
  }

  onReadyToMoveOn = () => {
    this.setState({
      isWaiting: true
    })
    actions.readyForNextTurn()
  }
  renderMoveOn = () => {
    if (this.state.isWaiting) {
      return <WaitingBlock />
    }
    else {
      const currentTurn = this.props.appState.gameState.turns.currentTurn
      return (
        <div>
          <Button onClick={this.onReadyToMoveOn}>
            Move on to turn {currentTurn + 1}
          </Button>
        </div>
      )
    }
  }

  render () {
    const currentTurn = this.props.appState.gameState.turns.currentTurn
    return (
      <div>
        <PlayerInfo appState={this.props.appState} />
        <hr />
        <h4>Turn {currentTurn} hits review:</h4>
        {this.renderTurnMoves()}
        <hr />
        {this.renderMoveOn()}
      </div>
    )
  }
}

export default ReviewTurn
