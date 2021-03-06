import React, { Component } from 'react';
import _ from 'lodash'

import actions from '../../actions'
import { PROFESSIONS, SKILLS } from '../../util/professions'

import Button from '../Button'
import PlayerInfo from '../PlayerInfo'
import WaitingBlock from '../WaitingBlock'
import HitsLog from './HitsLog'
import DeadPeople from './DeadPeople'

class ReviewTurn extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  state = {
    isWaiting: false
  }

  onReadyToMoveOn = () => {
    this.setState({
      isWaiting: true
    })
    actions.readyForNextTurn()
  }
  renderMoveOn = () => {
    if (this.state.isWaiting) {
      return <WaitingBlock appState={this.props.appState} />
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
        <HitsLog appState={this.props.appState} />
        <DeadPeople appState={this.props.appState} />
        <hr />
        {this.renderMoveOn()}
      </div>
    )
  }
}

export default ReviewTurn
